const express = require('express');
const { getMenu } = require('../services/nutrislice');

const router = express.Router();

// Yale residential college dining halls & their Nutrislice slugs
// (from yaledining.nutrislice.com URLs)
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


router.get('/', (req, res) => {
    res.json({ message: 'Dining API root' });
  });
  
  /**
   * GET /api/dining/all?days=7
   */
  router.get('/all', async (req, res) => {
    const days = Number.parseInt(req.query.days, 10) || 7;
    const dates = getNextNDates(days);
  
    try {
      const halls = await Promise.all(
        LOCATIONS.map((hall) => buildHallSchedule(hall, dates))
      );
  
      res.json({ halls });
    } catch (err) {
      console.error(err?.response?.data || err.message);
      res.status(500).json({ error: 'Failed to fetch dining data for all halls' });
    }
  });
  
  /**
   * GET /api/dining/:locationSlug?date=YYYY-MM-DD
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
  
      const hallMeta =
        LOCATIONS.find((h) => h.slug === locationSlug) || {
          slug: locationSlug,
          name: toTitleCase(locationSlug.replace(/-/g, ' ')),
        };
  
      const day = await buildDayMeals(locationSlug, date);
  
      return res.json({
        diningHall: {
          slug: hallMeta.slug,
          name: hallMeta.name,
        },
        days: [day],
      });
    } catch (err) {
      console.error(err?.response?.data || err.message);
      if (err.response && err.response.status === 404) {
        return res
          .status(404)
          .json({ error: 'Menu not found for that hall/date' });
      }
      return res
        .status(500)
        .json({ error: 'Failed to fetch or process menu data' });
    }
  });
  

//
// Helpers
//

// Build schedule for a hall over multiple dates
async function buildHallSchedule(hall, dates) {
  const days = [];

  for (const date of dates) {
    const day = await buildDayMeals(hall.slug, date);
    days.push(day);
  }

  return {
    slug: hall.slug,
    name: hall.name,
    days,
  };
}

// Build meals (breakfast/lunch/dinner) for one hall on one date
async function buildDayMeals(locationSlug, date) {
  const results = await Promise.allSettled(
    MEAL_TYPES.map((mealType) =>
      getMenu({ locationSlug, menuType: mealType, date })
    )
  );

  const meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  results.forEach((result, index) => {
    const mealType = MEAL_TYPES[index];

    if (result.status === 'fulfilled') {
      meals[mealType] = normalizeMeal(result.value, date);
    } else {
      meals[mealType] = [];
    }
  });

  return {
    date,
    meals,
  };
}

// Choose the correct day inside Nutrislice week data and flatten items
function normalizeMeal(nutrisliceData, targetDate) {
  if (!nutrisliceData || !Array.isArray(nutrisliceData.days)) return [];

  // Try to find the day matching the target date
  let day =
    nutrisliceData.days.find(
      (d) =>
        d.date === targetDate ||
        d.dateStr === targetDate ||
        d.fulldate === targetDate
    ) || nutrisliceData.days[0];

  if (!day || !Array.isArray(day.menu_items)) return [];

  return day.menu_items.map((item) => {
    const food = item.food || {};
    return {
      name: food.name || item.name || 'Unknown item',
      station: item.station || '',
      dietTags:
        item.food_dietary_preference_names ||
        item.dietary_preferences ||
        [],
      allergens:
        item.food_allergen_names ||
        item.allergens ||
        [],
    };
  });
}

function getNextNDates(n) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
    dates.push(iso);
  }

  return dates;
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = router;
