const { test, expect, request } = require('@playwright/test');
const { properties } = require('../Utilities/properties');
const { APIUtils } = require('../Utilities/APIUtils');
const loginPayload = { userEmail: properties.USER.EMAIL, userPassword: properties.USER.PASSWORD }
const orderPayload = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] }
const fakePayloadOrders = { data: [], message: "No Orders" }
const productName = 'ZARA COAT 3'
let response;
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);


});
test('Place the order', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, response.token)

    await page.goto('https://rahulshettyacademy.com/client/');

    console.log("Order#:" + response.orderId);
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route => {
        const response = await page.request.fetch(route.request())
        let body = JSON.stringify(fakePayloadOrders);
        route.fulfill(
            {
                response,
                body
            }
        )
    }
    )

    await page.getByRole("listitem").getByRole("button", { name: '  ORDERS' }).click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
    console.log(await page.locator(".mt-4").textContent());


})

