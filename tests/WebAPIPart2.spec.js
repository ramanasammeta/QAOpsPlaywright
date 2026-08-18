const { test, expect } = require('@playwright/test');
const { properties } = require('../Utilities/properties');
const { login, getFutureDate } = require('../Utilities/Helper');
let webContext;
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await login(page, properties.USER.EMAIL, properties.USER.PASSWORD);
    await expect(page.getByText("Browse Events →")).toBeVisible();
    await context.storageState({ path: 'sessionstate.json' });
    webContext = await browser.newContext({ storageState: 'sessionState.json' });
});

test('@Web Seat booking', async () => {
    const page = await webContext.newPage();

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

test('@Web Test 1 - Single ticket booking is eligible for refund', async () => {
    //Step1 - Login
    const page = await webContext.newPage();

    //Step2 - Book first event with 1 ticket (default)
    await page.goto(`${properties.WEB_BASE_URL}/events`);
    const eventCards = await page.locator("[data-testid='event-card']");
    await expect(eventCards.first()).toBeVisible();

    //Book now button should be enabled
    await eventCards.locator("[data-testid='book-now-btn'][aria-disabled='false']").first().click();

    await page.locator("[name='customerName']").fill("rahul");
    await page.locator("#customer-email").fill("rahul@gmail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("01238979012");
    await page.locator(".confirm-booking-btn").click();

    //Step3 - Navigate to booking detail
    await page.getByRole('button', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(/bookings/);
    await page.getByRole('button', { name: 'View Details' }).first().click();
    await expect(page.getByText("Booking Information")).toBeVisible();

    //Step4 - Validate booking ref
    const bookingRef = await page.locator(".font-mono").first().textContent();
    const eventTitle = await page.locator('h1').textContent();
    await expect(bookingRef.charAt[0]).toBe(eventTitle.charAt[0]);

    //Step 5-Check refund eligibility
    await page.locator("[data-testid='check-refund-btn']").click();
    const spinner = page.locator('#refund-spinner');
    // Spinner should appear
    await expect(spinner).toBeVisible();
    // Spinner should disappear within 6 seconds
    await expect(spinner).toBeHidden({ timeout: 6000 });

    //Step 6 - Validate result
    const refundResult = await page.locator("#refund-result")
    await expect(refundResult).toBeVisible();
    await expect(refundResult.getByText('Eligible for refund.')).toBeVisible();
    await expect(refundResult.getByText(' Single-ticket bookings qualify for a full refund.')).toBeVisible();
});




test('@Web Test 2 - Group ticket booking is NOT eligible for refund', async () => {
    //Step1 - Login
    const page = await webContext.newPage();

    //Step2 - Book first event with 1 ticket (default)
    await page.goto(`${properties.WEB_BASE_URL}/events`);
    const eventCards = await page.locator("[data-testid='event-card']");
    await expect(eventCards.first()).toBeVisible();

    //only cards with 'seats' left
    const groupEventCards = await eventCards.filter({ hasText: 'seats' })

    //Logic to find out first card with 3 or more seats left
    let matchingCard;

    const count = await groupEventCards.count();

    for (let i = 0; i < count; i++) {
        const card = await groupEventCards.nth(i);
        const seatCnttext = await card.locator('.text-xs').last().textContent();
        const seatCnt = Number(seatCnttext.split(" ")[0])

        console.log(seatCnt)
        if (seatCnt >= 3) {
            matchingCard = card;
            break;
        }
    }

    await matchingCard.locator('[data-testid="book-now-btn"]').click();
    await page.locator("button:has-text('+')").click();
    await page.locator("button:has-text('+')").click();
    await page.locator("[name='customerName']").fill("rahul");
    await page.locator("#customer-email").fill("rahul@gmail.com");
    await page.getByPlaceholder("+91 98765 43210").fill("01238979012");
    await page.locator(".confirm-booking-btn").click();

    //Step3 - Navigate to booking detail
    await page.getByRole('button', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(/bookings/);
    await page.getByRole('button', { name: 'View Details' }).first().click();
    await expect(page.getByText("Booking Information")).toBeVisible();

    //Step4 - Validate booking ref
    const bookingRef = await page.locator(".font-mono").first().textContent();
    const eventTitle = await page.locator('h1').textContent();
    await expect(bookingRef.charAt[0]).toBe(eventTitle.charAt[0]);

    //Step 5-Check refund eligibility
    await page.locator("[data-testid='check-refund-btn']").click();
    const spinner = page.locator('#refund-spinner');
    // Spinner should appear
    await expect(spinner).toBeVisible();
    // Spinner should disappear within 6 seconds
    await expect(spinner).toBeHidden({ timeout: 6000 });

    //Step 6 - Validate result
    const refundResult = await page.locator("#refund-result")
    await expect(refundResult).toBeVisible();
    await expect(refundResult.getByText('Not eligible for refund')).toBeVisible();
    await expect(refundResult.getByText('Group bookings (3 tickets) are non-refundable')).toBeVisible();
});