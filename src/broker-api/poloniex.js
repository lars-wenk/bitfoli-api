'use strict';

const Coinmarketcap = require('../helper/coinmarketcap');

const coinmarketcap = new Coinmarketcap();
const Poloniex = require('poloniex-api-node');
const debug = require('debug')('poloniex-api-node');

const poloniex = new Poloniex(
  config.Poloniex.API_KEY,
  config.Poloniex.API_SECRET, {
    socketTimeout: 15000
  }
);

exports.getPortfolio = () =>
  poloniex.returnBalances()
    .then(res => transform(res))
    .catch(console.error);

/*
 * transform in base schema
 *
 * @param {Array} res
 * @return {Array} Asset
 */
async function transform(res) {
  const ticker = await poloniex.returnTicker()
    .then(ticker => ticker)
    .catch(console.error);

  const BTCTicker = await coinmarketcap.getBTCTicker();
  const BTCEUR = BTCTicker[0].price_eur;
  const BTCUSD = BTCTicker[0].price_usd;

  // Frame
  const Asset = {
    broker: 'Poloniex',
    coins: [],
    total: 0,
    totalBTC: 0,
    countCoins: 0
  };

  for (const key in res) {
    if (res[key] <= 0.00001) {
      continue;
    }

    let btcBalance = res[key];
    if (key != 'BTC') {
      btcBalance = ticker[`BTC_${key}`].last;
      btcBalance *= res[key];
    }

    const eurBalance = btcBalance * BTCEUR;
    const usdBalance = btcBalance * BTCUSD;

    const lineAsset = {
      name: key,
      balance: res[key],
      btcBalance,
      eurBalance,
      usdBalance
    };

    Asset.total += eurBalance;
    Asset.totalBTC += btcBalance;
    Asset.countCoins++;
    Asset.coins.push(lineAsset);
  }

  return Asset;
}
