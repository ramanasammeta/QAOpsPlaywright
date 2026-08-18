const { test, expect } = require('@playwright/test');
test('Practice Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const emailVal = "rrsammeta75@gmail.com";
    const email = page.getByPlaceholder("email@example.com");
    const password = page.getByPlaceholder("enter your passsword");
    const login = page.getByRole("button", { name: 'login' });
    const products = page.locator('.card-body');
    const productName = 'ZARA COAT 3'

    const cardTitles = page.locator('.card-body b');

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    const title = await page.title();


    await email.fill(emailVal);
    await password.fill('Winter1!');
    await login.click();
    await cardTitles.first().waitFor();

    await page.locator(".card-body")
        .filter({ hasText: `${productName}` })
        .getByRole("button", { name: ' Add To Cart' })
        .click();

    /*
        const count = await products.count();
        console.log(await cardTitles.allTextContents());
        for (let i = 0; i < count; i++) {
            console.log(await products.nth(i).locator("b").textContent());
            if (await products.nth(i).locator("b").textContent() === productName) {
                console.log('found');
                await products.nth(i).locator("text= Add To Cart").click();
                break;
    
            }
        }
    */
    await page.getByRole("listitem").getByRole("button", { name: 'Cart' }).click();
    //  await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    await expect(page.getByText(`${productName}`)).toBeVisible();

    /*  const bool = await page.locator("h3:has-text( `${productName}`)").isVisible();
      expect(bool).toBeTruthy();
      */
    await page.getByRole("button", { name: 'Checkout' }).click();
    // await page.locator("text=Checkout").click();
    await expect(page.getByText(emailVal)).toBeVisible();
    const personalInfo = await page.locator(".form__cc [type='text']");
    await personalInfo.nth(0).fill("4533 9988 9200 2211");
    console.log(await page.locator("select").first().textContent())
    const expiryInfo = await page.locator('.field.small select');
    await expiryInfo.first().selectOption('05');
    await expiryInfo.last().selectOption('10');

    await personalInfo.nth(1).fill("016");
    await personalInfo.nth(2).fill("Samana");
    await personalInfo.nth(3).fill("RahulShetty");

    //await page.locator("[placeholder*='Country']").pressSequentially('ind');
    await page.getByPlaceholder('Select Country').pressSequentially('ind');
    const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();
    await dropdown.getByRole("button", { name: 'India' }).nth(1).click();
    /*
        const optionsCount = await dropdown.locator("button").count();
        for (let i = 0; i < optionsCount; i++) {
            const text = await dropdown.locator("button").nth(i).textContent();
            console.log(text);
            if (text === " India") {
    
                await dropdown.locator("button").nth(i).click();
                break;
            }
        }
            */

    //await expect(page.locator(".user__name [type='text']").first()).toHaveText(emailVal);

    await page.getByText('Place Order ').click();
    //await page.locator("text=Place Order ").click();
    // await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
    await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();



    const order = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const orderID = order.split('|')[1].trim();
    console.log("Order#:" + orderID);




    await page.getByRole("listitem").getByRole("button", { name: '  ORDERS' }).click();

    //await page.locator("button[routerlink*='orders']").click();

    const orderRowData = await page.locator("tbody")
    await orderRowData.waitFor();

    await page.locator("tbody tr")
        .filter({ hasText: `${orderID}` })
        .getByRole("button", { name: 'View' })
        .click();
    /*
         const rows = await orderRowData.locator("tr");
         console.log(await rows.count())
         for (let i = 0; i < await rows.count(); i++) {
             const rowOrderNo = await rows.nth(i).locator("th").textContent();
     
             if (orderId.includes(rowOrderNo)) {
                // await rows.nth(i).locator("button").first().click();
                 break;
             }
     
         }
              


    const orderDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderDetails)).toBeTruthy();*/
    await expect(page.getByText(orderID)).toBeVisible();
    await expect(page.getByText(emailVal).first()).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();

})