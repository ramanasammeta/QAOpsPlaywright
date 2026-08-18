
class OrdersHistoryPage {
    constructor(page) {
        this.page = page;
        this.ordersTable = page.locator("tbody")
        this.rows = page.locator("tbody tr")
        this.orderdIdDetails = page.locator(".col-text");
    }
    async searchOrderAndSelect(orderId) {

        await this.ordersTable.waitFor();
        await this.rows
            .filter({ hasText: orderId})
            .getByRole("button", { name: 'View' })
            .click();
    }
    async getOrderId() {
        return await this.orderdIdDetails.textContent();
    }
}
module.exports = { OrdersHistoryPage }