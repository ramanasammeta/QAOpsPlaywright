class DashboardPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator('.card-body');
        this.productsText = page.locator('.card-body b');
        this.cart = page.getByRole("listitem").getByRole("button", { name: 'Cart' });
        this.orders = page.getByRole("listitem").getByRole("button", { name: '  ORDERS' })
    }
    async searchProductAddCart(productName) {
        const count = await this.productsText.count();

        for (let i = 0; i < count; i++) {

            if (await this.products.nth(i).locator("b").textContent() === productName) {
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;

            }
        }
    }
    async goToCart() {
        await this.cart.click();
        await this.page.locator("div li").first().waitFor();

    }
    async goToOrders() {
        await this.orders.click();
    }

}
module.exports = { DashboardPage };