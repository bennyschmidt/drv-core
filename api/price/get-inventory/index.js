/* eslint-disable no-magic-numbers */

const dss = require('diamond-search-and-store');

const {
  NON_FUNGIBLE_RECORD,
  TREASURY_ADDRESS
} = require('../../../strings');

module.exports = async () => {
  let inventory = 1;

  let transactionsResult = await dss.onHttpPost(
    {
      method: 'read',
      body: {
        collectionName: 'transactions'
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

    transactionsResult.forEach(({
      senderAddress,
      recipientAddress,
      contract,
      drvValue
    }) => {
      if (contract === NON_FUNGIBLE_RECORD) return;

      if (senderAddress === TREASURY_ADDRESS) {
        inventory += drvValue;
      }

      if (recipientAddress === TREASURY_ADDRESS) {
        inventory -= drvValue;
      }
    });
  }

  return inventory;
};
