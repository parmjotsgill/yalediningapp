const express = require('express');
const db = require('../db/connection');

const router = express.Router();

// Yale residential college dining halls (matching database)
const LOCATIONS = [
  { slug: 'benjamin-franklin-college', name: 'Benjamin Franklin' },
  { slug: 'berkeley-college',          name: 'Berkeley' },
  { slug: 'branford-college',          name: 'Branford' },
  { slug: 'davenport-college',         name: 'Davenport' },
  { slug: 'ezra-stiles-college',       name: 'Ezra Stiles' },
  { slug: 'hopper-college',            name: 'Grace Hopper' },
  { slug: 'jonathan-edwards-college',  name: 'Jonathan Edwards' },
  { slug: 'morse-college',             name: 'Morse' },
  { slug: 'pauli-murray-college',      name: 'Pauli Murray' },
  { slug: 'pierson-college',           name: 'Pierson' },
  { slug: 'saybrook-college',          name: 'Saybrook' },
  { slug: 'silliman-college',          name: 'Silliman' },
  { slug: 'timothy-dwight-college',    name: 'Timothy Dwight' },
  { slug: 'trumbull-college',          name: 'Trumbull' },
];

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

/**
 * GET /api/dining/
 */
router.get('/', (req, res) => {
  res.json({ message: 'Dining API root (database-backed)' });
});

/**
 * GET /api/dining/all?days=7
 * Fetch all dining halls with menus for the next N days
 */
router.get('/all', async (req, res) => {
  const days = 7;
  const dates = getNextNDates(days);
  
  try {
    const halls = await Promise.all(
      LOCATIONS.map((hall) => buildHallScheduleFromDB(hall, dates))
    );

    res.json({ halls });
  } catch (err) {
    console.error('Error fetching all dining data:', err.message);
    res.status(500).json({ error: 'Failed to fetch dining data for all halls' });
  }
});

/**
 * GET /api/dining/:locationSlug?date=YYYY-MM-DD
 * Fetch menu for a specific hall and date
 */
router.get('/:locationSlug', async (req, res) => {
  try {
    const { locationSlug } = req.params;
    const date = req.query.date;

    if (!date) {
      return res
        .status(400)
        .json({ error: "Missing 'date' query param. Use ?date=YYYY-MM-DD" });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const hallMeta =
      LOCATIONS.find((h) => h.slug === locationSlug) || {
        slug: locationSlug,
        name: toTitleCase(locationSlug.replace(/-/g, ' ')),
      };

    const day = await buildDayMealsFromDB(locationSlug, date);

    return res.json({
      diningHall: {
        slug: hallMeta.slug,
        name: hallMeta.name,
      },
      days: [day],
    });
  } catch (err) {
    console.error('Error fetching menu:', err.message);
    return res
      .status(500)
      .json({ error: 'Failed to fetch menu data from database' });
  }
});

//
// Database Query Helpers
//

/**
 * Build schedule for a hall over multiple dates from database
 */
async function buildHallScheduleFromDB(hall, dates) {
  const days = [];

  for (const date of dates) {
    const day = await buildDayMealsFromDB(hall.slug, date);
    days.push(day);
  }

  return {
    slug: hall.slug,
    name: hall.name,
    days,
  };
}

/**
 * Build meals (breakfast/lunch/dinner) for one hall on one date from database
 */
async function buildDayMealsFromDB(locationSlug, date) {
  const meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  // Get hall ID from slug
  const hallQuery = `
    SELECT id, name 
    FROM dining_halls 
    WHERE slug = ?
  `;
  
  const hallRows = await db.query(hallQuery, [locationSlug]);
  
  if (!hallRows || hallRows.length === 0) {
    // Hall not found, return empty meals
    return { date, meals };
  }

  const hallId = hallRows[0].id;

  // Get all meals for this hall and date
  for (const mealType of MEAL_TYPES) {
    const menuItems = await getMenuItemsFromDB(hallId, date, mealType);
    meals[mealType] = menuItems;
  }

  return {
    date,
    meals,
  };
}

/**
 * Get menu items from database for a specific hall, date, and meal type
 */
async function getMenuItemsFromDB(hallId, date, mealType) {
  const query = `
    SELECT 
      mi.item_name,
      mi.station,
      GROUP_CONCAT(DISTINCT dt.tag_name) as dietary_tags,
      GROUP_CONCAT(DISTINCT a.allergen_name) as allergens
    FROM menu_items mi
    LEFT JOIN menu_item_dietary_tags midt ON mi.id = midt.menu_item_id
    LEFT JOIN dietary_tags dt ON midt.dietary_tag_id = dt.id
    LEFT JOIN menu_item_allergens mia ON mi.id = mia.menu_item_id
    LEFT JOIN allergens a ON mia.allergen_id = a.id
    WHERE mi.hall_id = ?
      AND mi.date = ?
      AND mi.meal_type = ?
    GROUP BY mi.id, mi.item_name, mi.station
    ORDER BY mi.station, mi.item_name
  `;

  const rows = await db.query(query, [hallId, date, mealType]);

  return rows.map((row) => ({
    name: row.item_name,
    station: row.station || '',
    dietTags: row.dietary_tags ? row.dietary_tags.split(',') : [],
    allergens: row.allergens ? row.allergens.split(',') : [],
  }));
}

//
// Utility Functions
//

function getNextNDates(n) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    console.log('d', d);
    d.setDate(today.getDate() + i);
    
    // Get local date in YYYY-MM-DD format (avoiding UTC timezone issues)
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${year}-${month}-${day}`;
    
    dates.push(iso);
  }

  return dates;
}

module.exports = router;