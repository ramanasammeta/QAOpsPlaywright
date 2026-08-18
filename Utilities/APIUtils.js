const { properties } = require('../Utilities/properties');
class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }
    async getToken() {

        const loginResponse = await this.apiContext.post(`${properties.API_BASE_URL}/auth/login`, { data: this.loginPayload });
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;
    }
    async createOrder(orderPayload) {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post(`${properties.API_BASE_URL}/order/create-order`,
            {
                data: orderPayload,
                headers: {
                    'Authorization': response.token,
                    'content-type': 'application/json'
                }

            });
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);

        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response;
    }
}


module.exports = { APIUtils };