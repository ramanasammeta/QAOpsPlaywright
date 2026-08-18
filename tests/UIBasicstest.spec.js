const { test, expect } = require('@playwright/test');
const { request } = require('node:http');
test('First Playwright Test', async ({ page }) => {

    await page.goto('https://google.co.uk');
    const title = await page.title();
    console.log(title);
    await expect(title).toBe('Google');
})

test('@Web Browser Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
   // page.route('**/*.{jpg,jpeg,png}', route => { route.abort() })
    const userName = page.locator('#username');
    const signIn = page.locator('[name="signin"]')
    const cardTitles = page.locator('.card-body a');
    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(),response.status()));
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const title = await page.title();

    console.log(title);

    await userName.fill('rahulshetty');
    await page.locator('[name="password"]').fill('Learning@830$3mK2');
    await page.locator("#terms").click();
    await signIn.click();
    console.log(await page.locator('[style*="block"]').textContent());
    await expect(page.locator('[style*="block"]')).toContainText('Incorrect');
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
})

test('UI Controls Playwright Test', async ({ page }) => {

    const userName = page.locator('#username');
    const signIn = page.locator('[name="signin"]')
    const password = page.locator('[name="password"]');
    const dropdown = page.locator('select.form-control');
    const documentLink = page.locator('a[href*="documents-request"]');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');


    await userName.fill('rahulshetty');
    await password.fill('Learning@830$3mK2');
    await dropdown.selectOption('consult');
    await page.locator('.radiotextsty').last().click();
    await page.locator('#okayBtn').click();
    console.log(await page.locator('.radiotextsty').last().isChecked());
    await expect(page.locator('.radiotextsty').last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck();
    await expect(page.locator('#terms')).not.toBeChecked();
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');

    // await page.pause()
    //await signIn.click();
})
test('Child Window Playwright Test', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink = page.locator('a[href*="documents-request"]');
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        documentLink.click()
    ]);
    const text = await newPage.locator(".red").textContent();
    console.log(text);
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").inputValue());


})
