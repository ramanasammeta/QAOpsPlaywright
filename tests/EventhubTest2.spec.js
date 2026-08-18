const { test, expect } = require('@playwright/test');
const { properties } = require('../Utilities/properties');
async function loginAndGoToBooking(page) {

    await page.goto(`${properties.WEB_BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(properties.USER.EMAIL);
    await page.getByLabel("password").fill(properties.USER.PASSWORD);
    await page.locator("#login-btn").click();
    await expect(page.getByText("Browse Events →")).toBeVisible();
}
test('Test 1 - Single ticket booking is eligible for refund', async ({ page }) => {
    //Step1 - Login
    await loginAndGoToBooking(page);

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




test('Test 2 - Group ticket booking is NOT eligible for refund', async ({ page }) => {
    //Step1 - Login
    await loginAndGoToBooking(page);

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