const { test, expect } = require('@playwright/test');
const { getFutureDate, login } = require('../Utilities/Helper');
const { properties } = require('../Utilities/properties');

test('Login Test', async ({ browser }) => {
    //Step 1 — Login
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page);
    await expect(page.getByText("Browse Events →")).toBeVisible();

    //Step 2 — Create a new event
    await page.goto(`${properties.WEB_BASE_URL}/admin/events`);

    const eventTitle = `Test Event ${Date.now()}`
    await page.locator("#event-title-input").fill(eventTitle);
    await page.locator("#admin-event-form textarea").fill("sample event " + eventTitle);
    await page.getByLabel("category").selectOption("Workshop");
    await page.getByLabel("city").fill("Hyderabad");
    await page.getByLabel("venue").fill("Hitex exhibition");
    await page.locator("input[id='event-date-&-time']").fill(getFutureDate(7));
    await page.locator("input[id='price-($)']").fill("100");
    await page.locator("#total-seats").fill("50");
    await page.locator("#add-event-btn").click();
    await expect(page.getByText('Event created!')).toBeVisible();


    //Step 3 — Find the event card and capture seats
    await page.goto(`${properties.WEB_BASE_URL}/events`);
    let eventCards = await page.locator("[data-testid='event-card']");
    await expect(eventCards.first()).toBeVisible();
    let myEventCard = eventCards.filter({ hasText: `${eventTitle}` })
    await expect(myEventCard).toBeVisible({ timeout: 5000 });

    let seatsText = await myEventCard.locator("span:has-text('seats')").textContent()
    const seatsBeforeBooking = Number(seatsText.split(" ")[0])
    //console.log("seatsBeforeBooking : " + seatsBeforeBooking)

    //Step 4 — Start booking
    await myEventCard.locator("[data-testid='book-now-btn']").click();

    //Step 5 — Fill booking form
    await expect(page.locator("#ticket-count")).toHaveText("1");
    await page.locator("[name='customerName']").fill("rahul");
    await page.locator("#customer-email").fill("rahul@gmail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("01238979012");
    await page.locator(".confirm-booking-btn").click();

    //Step 6 — Verify booking confirmation
    await expect(page.locator(".booking-ref")).toBeVisible();
    const bookingRef = await page.locator(".booking-ref").textContent();
    // console.log(bookingRef)

    //Step 7 — Verify in My Bookings
    await page.getByRole('button', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(/bookings/);
    const bookingcards = page.locator("#booking-card")
    await expect(bookingcards.first()).toBeVisible();
    const myBookingCard = bookingcards.locator(".booking-ref").filter({ hasText: `${bookingRef}` })

    await expect(myBookingCard).toBeVisible();
    await expect(myBookingCard).toHaveText(bookingRef);

    //Step 8 — Verify seat reduction
    await page.goto(`${properties.WEB_BASE_URL}/events`);
    // eventCards = await page.locator("[data-testid='event-card']");
    await expect(eventCards.first()).toBeVisible();
    myEventCard = eventCards.filter({ hasText: `${eventTitle}` });
    await expect(myEventCard).toBeVisible();
    const seatsAfterBooking = parseInt(await myEventCard.getByText('seat').first().innerText());

    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1)

});