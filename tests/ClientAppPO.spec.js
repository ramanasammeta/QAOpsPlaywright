const { test, expect } = require('@playwright/test');
const { customtest } = require('../Utilities/test-base');
const { POManager } = require('../pageObjects/POManager');
const dataSet = JSON.parse(JSON.stringify(require('../Utilities/ordersTestData.json')))
for (const data of dataSet) {
    test(`Client App E2E testing for:${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);

        const login = poManager.getLoginPage(page)
        await login.gotToLoginPage();
        await login.validLogin(data.userName, data.password);

        const dashboardPage = poManager.getDashboardPage(page);
        await dashboardPage.searchProductAddCart(data.productName)
        await dashboardPage.goToCart();

        const cartPage = poManager.getCartPage();
        await cartPage.VerifyProductIsDisplayed(data.productName);
        await cartPage.checkOutCart();


        const orderPage = poManager.getOrderPage(page);
        await orderPage.VerifyEmailId(data.userName);
        await orderPage.fillOrderForm(
            "4533 9988 9200 2211",
            "05/27",
            "016",
            "Samana",
            "RahulShetty",
            "ind"
        );

        const orderId = await orderPage.placeOrderAndGetOrderID()
        console.log(orderId)

        await dashboardPage.goToOrders();

        const ordersHistoryPage = poManager.getOrdersHistoryPage(page)
        await ordersHistoryPage.searchOrderAndSelect(orderId)
        expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

    })
};
customtest('@Web Client App E2E testing using fixers', async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page);

    const login = poManager.getLoginPage(page)
    await login.gotToLoginPage();
    await login.validLogin(testDataForOrder.userName, testDataForOrder.password);

    const dashboardPage = poManager.getDashboardPage(page);
    await dashboardPage.searchProductAddCart(testDataForOrder.productName)
    await dashboardPage.goToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.checkOutCart();
})

