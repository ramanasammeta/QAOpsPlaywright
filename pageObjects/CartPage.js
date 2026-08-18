const {  expect } = require('@playwright/test');
class CartPage {
    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.checkOut = page.getByRole("button", { name: 'Checkout' })
    }
    getProductLocator(productName) {
        return this.page.locator("h3:has-text('" + productName + "')");
    }
    async VerifyProductIsDisplayed(productName) {

        await this.cartProducts.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy();

    }
    async checkOutCart() {
        await this.checkOut.click();
    }
}
module.exports = { CartPage }


