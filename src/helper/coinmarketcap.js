'use strict';

const request = require('request');

const url = 'https://api.coinmarketcap.com/v1/';
module.exports = class Coinmarketcap {
  getTicker(limit) {
    limit = (limit) || 4;
    return new Promise((res, rej) => {
      request.get({
        url: `${url}ticker/?convert=EUR&limit=${limit}`,
        json: true
      }, (err, resp, body) => {
        if (err) return rej(new Error('Can\'t reach coin market cap server.'));
        return res(body);
      });
    });
  }

  getBTCTicker() {
    return new Promise((res, rej) => {
      request.get({
        url: `${url}ticker/bitcoin/?convert=EUR`,
        json: true
      }, (err, resp, body) => {
        if (err) return rej(new Error('Can\'t reach coin market cap server.'));
        return res(body);
      });
    });
  }
};
