const axios = require('axios');

const nutrislice = axios.create({
  baseURL: 'https://yaledining.api.nutrislice.com/menu/api',
  timeout: 8000,
});

/**
 * Fetch Nutrislice menu week data for a location/meal/date.
 * @param {string} locationSlug e.g. 'silliman-college'
 * @param {string} menuType 'breakfast' | 'lunch' | 'dinner'
 * @param {string} date 'YYYY-MM-DD'
 */
async function getMenu({ locationSlug, menuType, date }) {
  const [year, month, day] = date.split('-');
  const url = `/weeks/school/${locationSlug}/menu-type/${menuType}/${year}/${month}/${day}/?format=json`;
  const res = await nutrislice.get(url);
  return res.data;
}

module.exports = { getMenu };
