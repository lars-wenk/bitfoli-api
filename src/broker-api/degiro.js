'use strict';

const DeGiro = require('degiro');

const degiro = DeGiro.create({
  username: config.DeGiro.Username,
  password: config.DeGiro.Password
});

exports.getPortfolio = () =>
  degiro.login().then(() => degiro.getPortfolio())
    .then(res => transform(res, degiro))
    .catch(console.error);

/*
 * transform in base schema
 *
 * @param {Object} res
 * @param {Array} res.portfolio
 * @param {Object} degiro
 * @param {Method} degiro.getProductsByIds
 * @return {Array} Asset
 */
async function transform(res, degiro) {
  const Asset = {
    broker: 'De Giro',
    stock: [],
    total: 0,
    totalBase: 0,
    totalRevenue: 0,
    countStocks: 0
  };

  for (const index in res.portfolio) {
    if (res.portfolio[index].value[1].value == 0) {
      continue;
    }

    const quantity = res.portfolio[index].value[1].value;
    const currentPrice = res.portfolio[index].value[2].value;
    const currency = res.portfolio[index].value[8].value;

    const diff = res.portfolio[index].value[6].value.EUR - res.portfolio[index].value[7].value.EUR;
    Asset.totalBase += Math.abs(res.portfolio[index].value[7].value.EUR);
    Asset.totalRevenue += diff;
    Asset.total += Math.abs(res.portfolio[index].value[7].value.EUR + diff);

    // let stockDetails = await degiro.login().then(() =>
    // degiro.getProductsByIds([res.portfolio[index].value[0].value]));

    const lineAsset = {
      // name : stockDetails.data[[res.portfolio[index].value[0].value]].name,
      // isin: stockDetails.data[[res.portfolio[index].value[0].value]].isin,
      name: 'stock',
      isin: '12346',
      quantity,
      currentPrice,
      basePrice: Math.abs(res.portfolio[index].value[6].value.EUR),
      basePriceTotal: Math.abs(res.portfolio[index].value[7].value.EUR),
      currency,
      diff
    };

    Asset.countStocks++;
    Asset.stock.push(lineAsset);
  }

  return Asset;
}
