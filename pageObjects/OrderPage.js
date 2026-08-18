
const { expect } = require('@playwright/test');
class OrderPage {

    constructor(page) {
        this.page = page;
        this.personalInfo = page.locator(".form__cc [type='text']");
        this.expiryInfo = page.locator('.field.small select');
        this.country = page.getByPlaceholder('Select Country')
        this.countryDropdown = page.locator(".ta-results");
        this.submitOrder = page.getByText('Place Order ');
        this.emailId = page.locator(".user__name [type='text']").first()
        this.orderConfirmation = page.locator(".hero-primary")
        this.orderIDText = page.locator(".em-spacer-1 .ng-star-inserted")

    }
    async fillOrderForm(creditCardNumber, expiryDate, cVV, name, coupon, countryVal) {
        await this.personalInfo.nth(0).fill(creditCardNumber);

        await this.expiryInfo.first().selectOption(expiryDate.split('/')[0]);
        await this.expiryInfo.last().selectOption(expiryDate.split('/')[1]);

        await this.personalInfo.nth(1).fill(cVV);
        await this.personalInfo.nth(2).fill(name);
        await this.personalInfo.nth(3).fill(coupon);


        await this.country.pressSequentially(countryVal);
        await this.countryDropdown.waitFor();
        await this.countryDropdown.getByRole("button", { name: countryVal }).nth(1).click();

    }
    async VerifyEmailId(username) {
        await expect(this.emailId).toHaveText(username);
    }
    async placeOrderAndGetOrderID() {
        await this.submitOrder.click();
        await expect(this.orderConfirmation).toHaveText(" Thankyou for the order. ")
        const orderDetails=await this.orderIDText.textContent()
        return orderDetails.split('|')[1].trim();

    }
}
module.exports = { OrderPage }

