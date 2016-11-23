'use strict';

const https = require('https');
const fetch = require('node-fetch');

const BondAPI = {

    baseUrl: 'https://api.bond.co',
    username: '',
    password: '',

    init(apiKey) {
        this.username = apiKey;
    },

    request(uri, opts) {

        opts.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${new Buffer(`${this.username}:${this.password}`).toString('base64')}`
        };

        console.log(`${this.baseUrl}/${uri}`, opts);
        fetch(`${this.baseUrl}/${uri}`, opts)
            .then(response => {
                console.log(response.json());
                return response.json();
            })
            .catch(err => {
                console.log(err);
                return response.json();
            });
    },

    Account: {
        show() {
            BondAPI.request('account', {
                method: 'GET',
            });
        },

        stationery() {

        },

        handwriting() {

        },

        handwritingById() {

        }
    },

    Orders: {
        list() {

        },

        show(orderGuid) {

        },

        create() {
            var that = this,
                request = {};

            return Config.getValuesPromise(Config.BOND_API_URL, Config.BOND_API_AUTH_NAME).then(function(bondApiAuth, configs) {
                request = {
                    method: 'POST',
                    url: Config.getValue(Config.BOND_API_URL) + '/orders',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Config.getValue(Config.BOND_API_AUTH_NAME)
                    }
                }

                return Parse.Cloud.httpRequest(request);
            }).then(function(httpResponse) {
                return Parse.Promise.as(httpResponse);
            }, function(error) {
                error.request = request
                return that.createErrorRecord('createOrderBackOffice', error).then(function() {
                    return Parse.Promise.error(Utils.isJson(error.text) ? JSON.parse(error.text) : error.text);
                });
            });
        },

        process(orderGuid) {

        },

        addMessageToOrder(orderGuid) {

        },

        listMessagesByOrder(orderGuid) {

        },

        getMessageByOrder(orderGuid, messageGuid) {

        }
    },

    Message: {

        previewContent() {

        },

        previewEnvelope() {

        }
    }
};

module.exports = BondAPI;
