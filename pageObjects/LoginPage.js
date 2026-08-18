class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInButton = page.getByRole("button", { name: 'login' });
        this.email = page.getByPlaceholder("email@example.com");
        this.password = page.getByPlaceholder("enter your passsword");
    }
    async gotToLoginPage() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login")

    }
    async validLogin(userName, password) {
        await this.email.fill(userName);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
module.exports={LoginPage};