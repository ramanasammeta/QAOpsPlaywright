const { test, expect, request } = require('@playwright/test');
const BASE_URL = 'https://eventhub.rahulshettyacademy.com'
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api'

const yahooLogin = { email: 'rsreddy@yahoo.com', password: 'Winter1!' }
const gmailLogin = { email: 'rsreddy@gmail.com', password: 'Winter1!' }

async function loginAPI(apiContext, loginPayload) {
    const loginResponse = await apiContext.post(`${API_URL}/auth/login`, { data: loginPayload });
    await expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    return loginResponseJson.token;
}
async function loginUI(page, username, password) {

    await page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(username);
    await page.getByLabel("password").fill(password);
    await page.locator("#login-btn").click();
    await expect(page.getByText("Browse Events →")).toBeVisible();
}
test('Cross User Booking Testing', async ({ page }) => {
    //Step 1 — Login as Yahoo user via API  
    const apiContext = await request.newContext();
    const yahooUserToken = await loginAPI(apiContext, yahooLogin);

    //    Step 2 — Fetch events via API to get a valid event ID
    const eventResponse = await apiContext.get(`${API_URL}/events`,
        {
            headers: {
                'Authorization': 'Bearer ' + yahooUserToken
            }
        });
    await expect(eventResponse.ok()).toBeTruthy();
    const eventResponseJson = await eventResponse.json();
    const eventID = eventResponseJson.data[1].id;
console.log(eventID)
    //Step 3 — Create a booking via API as Yahoo user
    const bookingResponse = await apiContext.post(`${API_URL}/bookings`,
        {
            headers: {
                'Authorization': 'Bearer ' + yahooUserToken
            },
            data: {
                "eventId": eventID,
                "customerName": "Yahoo User",
                "customerEmail": yahooLogin.email,
                "customerPhone": "+91-9876543210",
                "quantity": 1

            }
        });
    
    await expect(bookingResponse.ok()).toBeTruthy();
    const bookingResponseJson = await bookingResponse.json();
    const yahooBookingId = bookingResponseJson.data.id;

    //Step 4 — Login as Gmail user via browser UI
    await loginUI(page, gmailLogin.email, gmailLogin.password);

    //Step 5 — Navigate to Yahoo's booking URL as Gmail user
    await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`);
    await page.waitForLoadState('networkidle');
    
    //Step 6 — Validate Access Denied
    await expect(page.getByText('Access Denied')).toBeVisible()
    await expect(page.getByText('You are not authorized to view this booking')).toBeVisible()


})