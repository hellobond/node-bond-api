'use strict';

const https = require('https');
const fetch = require('node-fetch');

const BondAPI = {

    // baseUrl: 'https://api.bond.co',
    baseUrl: 'https://dev-bbwrapper.bondco.io',
    username: '',
    password: '',

    beforeRequestHook(url, opts) {},
    afterRequestHook(responseJson) {},

    init(username, password) {
        this.username = username;
        this.password = password;
    },

    request(uri, opts, params) {
        const buffer = new Buffer(`${this.username}:${this.password}`).toString('base64');
        opts.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${buffer}`
        };

        let query = '';

        if (params) {
            query = '?' + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
        }

        const url = `${this.baseUrl}/${uri}${query}`;

        this.beforeRequestHook(url, opts);

        return fetch(url, opts)
            .then(response => response.json())
            .then(responseJson => {
                this.afterRequestHook(responseJson);

                return new Promise((resolve, reject) => {
                    if (responseJson.data) {
                        resolve(responseJson);
                    }

                    reject(responseJson)
                });
            });
    },

    Account: {
        show() {
            return BondAPI.request('account', {
                method: 'GET',
            });
        },

        Stationery: {

            list(params) {
                return BondAPI.request('account/stationery', {
                    method: 'GET',
                }, params);
            },

            show(id) {
                return BondAPI.request(`account/stationery/${id}`, {
                    method: 'GET',
                });
            },
        },

        Handwriting: {

            list(params) {
                return BondAPI.request('account/handwriting-styles', {
                    method: 'GET',
                }, params);
            },

            show(id) {
                return BondAPI.request(`account/handwriting-styles/${id}`, {
                    method: 'GET',
                });
            },
        }
    },

    Orders: {
        list(params) {
            return BondAPI.request('orders', {
                method: 'GET',
            }, params);
        },

        show(guid) {
            return BondAPI.request(`orders/${guid}`, {
                method: 'GET',
            });
        },

        create() {
            return BondAPI.request(`orders`, {
                method: 'POST'
            });
        },

        process(guid) {
            return BondAPI.request(`orders/${guid}/process`, {
                method: 'POST'
            });
        },

        Messages: {

            create(orderGuid, data) {
                return BondAPI.request(`orders/${orderGuid}/messages`, {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
            },

            list(orderGuid, params) {
                return BondAPI.request(`orders/${orderGuid}/messages`, {
                    method: 'GET',
                }, params);
            },

            show(orderGuid, messageGuid) {
                return BondAPI.request(`orders/${orderGuid}/messages/${messageGuid}`, {
                    method: 'GET',
                });
            }
        }

    },

    Message: {

        previewContent(data) {
            return BondAPI.request(`messages/preview/content`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        previewEnvelope(data) {
            return BondAPI.request(`messages/preview/envelope`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
    }
};

module.exports = BondAPI;

// echo 'Signature: ' . Utf8::chr(hexdec('E000'));
// echo 'Emoticon: ' . Utf8::chr(hexdec('E001'));

function hexToDec(hexString) {
    hexString = (hexString + '').replace(/[^a-f0-9]/gi, '')
    return parseInt(hexString, 16)
}

BondAPI.init('wrapper@bond.co', 'Bond2017')
BondAPI.Message.previewContent({
    stationery_id: '57f6109e2a9ca00014c41a83',
    handwriting: {
        id: '57f60fed2a9ca00014c41a18',
        size: 14
    },
    "content": "This message includes an signature - " + String.fromCharCode(hexToDec('E001'))
}).then(response => {
    console.log(response)
}, errors => {
    console.error(errors)
})