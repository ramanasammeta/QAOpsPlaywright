const excelJS = require('exceljs');
const { test, expect } = require('@playwright/test');
async function writeExcelTest(searchText, replaceText, deltaChange, filePath) {
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = await readExcel(worksheet, searchText);
    const cell = worksheet.getCell(output.row, output.col + deltaChange.colChange)
    cell.value = replaceText
    await workbook.xlsx.writeFile(filePath)
}
async function readExcel(worksheet, searchText) {
    let output = { row: -1, col: -1 };
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                console.log(rowNumber, colNumber);
                output.row = rowNumber
                output.col = colNumber

            }
        })
    })
    return output
}

test('Upload download excel validation', async ({ page }) => {
    const searchText='Papaya';
    const updateValue='111';
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole("button", { name: 'Download' }).click();
    const download = await downloadPromise;
    await download.saveAs(`./downloads/${download.suggestedFilename()}`);
    writeExcelTest(searchText, updateValue, { rowChange: 0, colChange: 2 }, `./downloads/${download.suggestedFilename()}`);
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles(`./downloads/${download.suggestedFilename()}`)

    const textlocator=page.getByText(searchText);
    const desiredRow=await page.getByRole('row').filter({has:textlocator});
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
})
