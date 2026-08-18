const { properties } = require('../Utilities/properties');
function getFutureDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}T10:00`;

}
async function login(page) {

    await page.goto(`${properties.WEB_BASE_URL}/login`)
    await page.getByPlaceholder("you@email.com").fill(properties.USER.EMAIL);
    await page.getByLabel("password").fill(properties.USER.PASSWORD);
    await page.locator("#login-btn").click();
  
}

module.exports = { getFutureDate, login };