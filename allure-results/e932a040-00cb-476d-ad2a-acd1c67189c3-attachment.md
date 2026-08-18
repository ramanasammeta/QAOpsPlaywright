# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: CrossUserBookingTest.spec.js >> Cross User Booking Testing
- Location: tests\CrossUserBookingTest.spec.js:22:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | const { test, expect, request } = require('@playwright/test');
  2  | const BASE_URL = 'https://eventhub.rahulshettyacademy.com'
  3  | const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api'
  4  | 
  5  | const yahooLogin = { email: 'rsreddy@yahoo.com', password: 'Winter1!' }
  6  | const gmailLogin = { email: 'rsreddy@gmail.com', password: 'Winter1!' }
  7  | 
  8  | async function loginAPI(apiContext, loginPayload) {
  9  |     const loginResponse = await apiContext.post(`${API_URL}/auth/login`, { data: loginPayload });
  10 |     await expect(loginResponse.ok()).toBeTruthy();
  11 |     const loginResponseJson = await loginResponse.json();
  12 |     return loginResponseJson.token;
  13 | }
  14 | async function loginUI(page, username, password) {
  15 | 
  16 |     await page.goto(`${BASE_URL}/login`);
  17 |     await page.getByPlaceholder("you@email.com").fill(username);
  18 |     await page.getByLabel("password").fill(password);
  19 |     await page.locator("#login-btn").click();
  20 |     await expect(page.getByText("Browse Events →")).toBeVisible();
  21 | }
  22 | test('Cross User Booking Testing', async ({ page }) => {
  23 |     //Step 1 — Login as Yahoo user via API  
  24 |     const apiContext = await request.newContext();
  25 |     const yahooUserToken = await loginAPI(apiContext, yahooLogin);
  26 | 
  27 |     //    Step 2 — Fetch events via API to get a valid event ID
  28 |     const eventResponse = await apiContext.get(`${API_URL}/events`,
  29 |         {
  30 |             headers: {
  31 |                 'Authorization': 'Bearer ' + yahooUserToken
  32 |             }
  33 |         });
  34 |     await expect(eventResponse.ok()).toBeTruthy();
  35 |     const eventResponseJson = await eventResponse.json();
  36 |     const eventID = eventResponseJson.data[1].id;
  37 | console.log(eventID)
  38 |     //Step 3 — Create a booking via API as Yahoo user
  39 |     const bookingResponse = await apiContext.post(`${API_URL}/bookings`,
  40 |         {
  41 |             headers: {
  42 |                 'Authorization': 'Bearer ' + yahooUserToken
  43 |             },
  44 |             data: {
  45 |                 "eventId": eventID,
  46 |                 "customerName": "Yahoo User",
  47 |                 "customerEmail": yahooLogin.email,
  48 |                 "customerPhone": "+91-9876543210",
  49 |                 "quantity": 1
  50 | 
  51 |             }
  52 |         });
  53 |     
> 54 |     await expect(bookingResponse.ok()).toBeTruthy();
     |                                        ^ Error: expect(received).toBeTruthy()
  55 |     const bookingResponseJson = await bookingResponse.json();
  56 |     const yahooBookingId = bookingResponseJson.data.id;
  57 | 
  58 |     //Step 4 — Login as Gmail user via browser UI
  59 |     await loginUI(page, gmailLogin.email, gmailLogin.password);
  60 | 
  61 |     //Step 5 — Navigate to Yahoo's booking URL as Gmail user
  62 |     await page.goto(`${BASE_URL}/bookings/${yahooBookingId}`);
  63 |     await page.waitForLoadState('networkidle');
  64 |     
  65 |     //Step 6 — Validate Access Denied
  66 |     await expect(page.getByText('Access Denied')).toBeVisible()
  67 |     await expect(page.getByText('You are not authorized to view this booking')).toBeVisible()
  68 | 
  69 | 
  70 | })
```