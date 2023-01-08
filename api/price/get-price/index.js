/* eslint-disable no-magic-numbers */

const dss = require('diamond-search-and-store');

const { ROOT_VALUE } = require('../../../numbers');

module.exports = async () => {
  let transactionsResult = await dss.onHttpPost(
    {
      method: 'read',
      body: {
        collectionName: 'transactions',
        page: 1
      },
      route: {
        path: '/'
      },
      path: 'read'
    },
    {
      status: code => ({
        end: () => ({
          error: {
            code,
            message: '<DRV> Service error (POST).'
          }
        })
      }),
      send: body => ({
        status: 200,
        success: true,
        data: body
      })
    }
  );

  transactionsResult = transactionsResult.data;

  if (transactionsResult.length) {
    const prices = transactionsResult.map(({ price }) => price);

    const averagePrice = (
      prices.reduce((a = 0.01, b = 0.01) => parseFloat(a) + parseFloat(b)) / prices.length
    );

    return parseFloat(averagePrice).toFixed(10);
  }

  return ROOT_VALUE;
};
