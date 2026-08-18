const { test, expect, request } = require('@playwright/test');
const { properties } = require('../Utilities/properties');
const { APIUtils } = require('../Utilities/APIUtils');
const loginPayload = { userEmail: properties.USER.EMAIL, userPassword: properties.USER.PASSWORD }
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] }

const productName = 'ZARA COAT 3'
let response;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);


});
test('@API Place the order', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, response.token)

    await page.goto('https://rahulshettyacademy.com/client/');

    console.log("Order#:" + response.orderId);

    await page.getByRole("listitem").getByRole("button", { name: '  ORDERS' }).click();

    const orderRowData = await page.locator("tbody")
    await orderRowData.waitFor();

    await page.locator("tbody tr")
        .filter({ hasText: `${response.orderId}` })
        .getByRole("button", { name: 'View' })
        .click();

    await expect(page.getByText(response.orderId)).toBeVisible();
    await expect(page.getByText(properties.USER.EMAIL).first()).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();

})

