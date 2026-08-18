const { test, expect } = require('@playwright/test');
const { properties } = require('../Utilities/properties');
const USER_EMAIL = properties.USER.EMAIL
const USER_PASSWORD = properties.USER.PASSWORD
const BASE_URL = properties.WEB_BASE_URL
const FOUR_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};
const SIX_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
        { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
        { id: 6, title: 'AI & ML Expo', category: 'Conference', eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};
async function loginAndGoToBooking(page) {

    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(USER_EMAIL);
    await page.getByLabel("password").fill(USER_PASSWORD);
    await page.locator("#login-btn").click();
    await expect(page.getByText("Browse Events →")).toBeVisible();
}

test('Test 1 — Banner IS visible when 6 events are returned', async ({ page }) => {

    //Step 1 — Set up the API mock
    await page.route("https://api.eventhub.rahulshettyacademy.com/api/events?*", async route => {
        const response = await page.request.fetch(route.request())
        let body = JSON.stringify(SIX_EVENTS_RESPONSE);
        route.fulfill(
            {
                response,
                body,
                status: 200,
                contentType: 'application/json'
            }
        )
    }
    )
    //Step 2 — Login and navigate
    await loginAndGoToBooking(page);
    //Step 3 — Verify cards loaded from mock
    await page.goto(`${BASE_URL}/events`);
    let eventCards = await page.locator("[data-testid='event-card']");
    await expect(eventCards.first()).toBeVisible();
     expect(await eventCards.count()).toEqual(6);
    //Step 4 — Verify banner is visible
    await expect(page.getByText(/sandbox holds up to/i)).toBeVisible();
    await expect(page.getByText(/9 bookings/i)).toBeVisible();
    

})

test('Test 2 — Banner is NOT visible when 4 events are returned', async ({ page }) => {

    //Step 1 — Set up the API mock
    await page.route("https://api.eventhub.rahulshettyacademy.com/api/events?*", async route => {
        const response = await page.request.fetch(route.request())
        let body = JSON.stringify(FOUR_EVENTS_RESPONSE);
        route.fulfill(
            {
                response,
                body,
                status: 200,
                contentType: 'application/json'
            }
        )
    })
    //Step 2 — Login and navigate
    await loginAndGoToBooking(page, USER_EMAIL, USER_PASSWORD);
    //Step 3 — Verify cards loaded from mock
    await page.goto(`${BASE_URL}/events`);
    let eventCards = await page.locator("[data-testid='event-card']");
    await expect(eventCards.first()).toBeVisible();
     expect(await eventCards.count()).toEqual(4);
    //Step 4 — Verify banner is hidden
    await expect(page.getByText('/sandbox holds up to/i')).toBeHidden();
})