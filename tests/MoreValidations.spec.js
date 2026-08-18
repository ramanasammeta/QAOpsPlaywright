
const { test, expect } = require('@playwright/test')
test("Popup validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    /* await page.goto("http://google.co.uk");
     await page.goBack();
     await page.goForward();*/
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
  //  await page.pause();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();

    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);

})
test("Screenshot", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path:'element-screenshot.png'})
    await page.locator("#hide-textbox").click();
    await page.screenshot({path:'page-screenshot.png'})
    await expect(page.locator("#displayed-text")).toBeHidden();


})

test("visual test", async ({ page }) => {
    await page.goto("https://www.timeanddate.com/worldclock");
   
    expect(await page.screenshot()).toMatchSnapshot('landing-win32.png');

})