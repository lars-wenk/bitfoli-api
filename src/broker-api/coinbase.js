'use strict';

const coinbase = require('coinbase');
const Coinmarketcap = require('../helper/coinmarketcap');

const coinmarketcap = new Coinmarketcap();

const client = new coinbase.Client({
  apiKey: config.Coinbase.api_key,
  apiSecret: config.Coinbase.secret_key
});

// const { promisify } = require('util');
// const getAccountsAsync = promisify(client.getAccounts).bind(client);
exports.getPortfolio = () =>
  client.getAccounts({}, (err, res) => transform(res));

/*
 * transform in base schema
 *
 * @param {Array} res
 * @return {Array} Asset
 */
async function transform(res) {
  const BTCTicker = await coinmarketcap.getBTCTicker();
  const BTCEUR = BTCTicker[0].price_eur;
  const BTCUSD = BTCTicker[0].price_usd;

  // Frame
  const Asset = {
    broker: 'Coinbase',
    coins: [],
    total: 0,
    totalBTC: 0,
    countCoins: 0
  };

  res.forEach((res) => {
    const btcBalance = 0;
    const eurBalance = 0;
    const usdBalance = 0;
    const coinname = res.name.match(/[^\s]+/);
    const lineAsset = {
      name: coinname,
      balance: res.balance.amount,
      btcBalance,
      eurBalance,
      usdBalance
    };

    console.log(`my bal: ${res.balance.amount} for ${res.name}`);

    Asset.countCoins++;
    Asset.total += eurBalance;
    Asset.totalBTC += btcBalance;
    Asset.coins.push(lineAsset);
  });

  return Asset;
}
