const base = require('@playwright/test')
exports.customtest = base.test.extend(
    {
        testDataForOrder:
        {
            userName: "geeth@gmail.com",
            password: "Winter123!",
            productName: "iphone 13 pro"
        }
    }
)