const { LoginPage } = require('../pageObjects/LoginPage');
const { DashboardPage } = require('../pageObjects/DashboardPage');
const { CartPage } = require('./CartPage');
const { OrderPage } = require('../pageObjects/OrderPage');
const { OrdersHistoryPage } = require('../pageObjects/OrdersHistoryPage');

class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.orderPage = new OrderPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    }
    getLoginPage() {
        return this.loginPage;
    }
    getDashboardPage() {
        return this.dashboardPage;
    }
    getCartPage() {
        return this.cartPage;
    }
    getOrderPage() {
        return this.orderPage;
    }
    getOrdersHistoryPage() {
        return this.ordersHistoryPage;
    }
}
module.exports = { POManager }