const { test, expect } = require('@playwright/test');
test('Security test request intercept', async ({ page }) => {

    const emailVal = "rrsammeta75@gmail.com";
    const email = page.getByPlaceholder("email@example.com");
    const password = page.getByPlaceholder("enter your passsword");
    const login = page.getByRole("button", { name: 'login' });

    const cardTitles = page.locator('.card-body b');

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    await email.fill(emailVal);
    await password.fill('Winter1!');
    await login.click();
    await cardTitles.first().waitFor();
    await page.getByRole("listitem").getByRole("button", { name: '  ORDERS' }).click();

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a609d7f85b8849b4902cdg2' })
    )
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator(".blink_me")).toHaveText('You are not authorize to view this order')
    await page.pause();


}
)