'use strict';

// user model 
const BFX = require('bitfinex-api-node');

const bfx = new BFX({
  apiKey: config.Bitfinex.API_KEY,
  apiSecret: config.Bitfinex.API_SECRET
});

const rest = bfx.rest(2, { transform: true });

exports.getPortfolio = () =>
  rest.wallets((err, data) => {
    if (err) {
      return debug('error: %j', err);
    }

    return transform(data);
  });

/*
 * transform in base schema
 *
 * @param {Array} res
 * @return {Array} Asset
 */
async function transform(res) {
  const BTCEUR = await transformCurrency('tBTCEUR');
  const BTCUSD = await transformCurrency('tBTCUSD');

  // Frame
  const Asset = {
    broker: 'Bitfinex',
    coins: [],
    total: 0,
    totalBTC: 0,
    countCoins: 0
  };

  for (var index in res) {
    if (res[index].currency == 'EUR') {
      continue;
    }

    const btcBalance = await getBTCValue(res[index].balance, res[index].currency);
    const eurBalance = btcBalance * BTCEUR;
    const usdBalance = btcBalance * BTCUSD;
    const lineAsset = {
      name: res[index].currency,
      balance: res[index].balance,
      btcBalance,
      eurBalance,
      usdBalance
    };

    if (Asset.coins.filter(coin => coin.name !== res[index].currency).length > 0) {
      Asset.countCoins++;
    }

    Asset.total += eurBalance;
    Asset.totalBTC += btcBalance;
    Asset.coins.push(lineAsset);
  }

  return Asset;
}

/*
 * calculate currency in BTC
 *
 * @param {String} balance
 * @param {String} currency
 * @return {String} BTCbalance
 */
async function getBTCValue(balance, currency) {
  if (currency == 'BTC') {
    return balance;
  }

  if (currency == 'EUR') {
    return 0;
  }

  const BTCbalance = rest.ticker(`t${currency}BTC`, (err, data) => {
    if (err) {
      return debug('error: %j', err);
    }

    return data.bid * balance;
  });

  return BTCbalance;
}

/*
 * Transform Value
 *
 * @param {String} t
 * @return String BTCEUR
 */
async function transformCurrency(t) {
  const BTCEUR = rest.ticker(t, (err, data) => {
    if (err) {
      return debug('error: %j', err);
    }

    return data.bid;
  });

  return BTCEUR;
}
