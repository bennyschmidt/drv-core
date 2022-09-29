/* eslint-disable no-magic-numbers */

require('dotenv').config();

const { http } = require('node-service-library');
const { generateUUID } = require('cryptography-utilities');

const { BAD_REQUEST } = require('./errors');
const { ZERO } = require('./numbers');
const { RECORD, NON_FUNGIBLE_RECORD } = require('./strings');

(async () => {
  const createTransactionApi = require('./api/transaction/init');

  const { transactions } = await createTransactionApi();

  const transactionApi = require('./api/transaction')(transactions);
  const priceApi = require('./api/price');

  const onTransaction = require('./events/create-on-transaction')({
    transactionApi,
    priceApi
  });

  const validations = require('./validations');
  const { broadcast } = require('./enforcements');

  const getPrice24hAgo = () => {
    const transaction = transactionApi
      .getTransactions()
      .filter(({ timestamp }) => (
        new Date().setHours(0, 0, 0, 0) ===
        new Date(timestamp).setHours(0, 0, 0, 0)
      ))
      .sort((a, b) => (
        a.timestamp < b.timestamp
          ? 1
          : a.timestamp > b.timestamp
            ? 0.01
            : 0
      ))
      .pop();

    return transaction && transaction.price;
  };

  module.exports = http({
    GET: {
      price: async () => {
        const price = await priceApi.getPrice();
        const marketCap = await priceApi.getMarketCap();
        const inventory = await priceApi.getInventory();
        const price24hAgo = await getPrice24hAgo();

        return {
          price,
          price24hAgo: price24hAgo || price,
          marketCap,
          inventory
        };
      },
      transactions: transactionApi.getTransactions
    },
    POST: {
      transaction: async ({
        senderAddress,
        recipientAddress,
        usdValue,
        drvValue,
        contract = RECORD,
        peers = [],
        isTest = false
      }) => {
        if (typeof (drvValue) !== 'number') {
          // eslint-disable-next-line no-param-reassign
          contract = NON_FUNGIBLE_RECORD;
        }

        const drv = contract === NON_FUNGIBLE_RECORD
          ? drvValue
          : Math.max(ZERO, drvValue);

        const hash = (
          transactionApi.getTransactions().pop()?.next ||
          generateUUID()
        );

        const next = generateUUID();

        const transaction = {
          hash,
          next,
          senderAddress,
          recipientAddress,
          contract,
          usdValue,
          drvValue: drv
        };

        const isValid = validations[contract](transaction);

        if (isTest) {
          return {
            success: isValid
          };
        }

        if (!isValid) {
          return BAD_REQUEST;
        }

        const transactions = transactionApi.getTransactions();

        if (transactions.find(existingTransaction => existingTransaction.hash === transaction.hash)) {
          console.log('<DRV> :: Transaction already exists. Skipping lifecycle, validation, & enforcements.');

          return { success: false };
        }

        transaction.status = await broadcast(transaction, peers);

        const result = await onTransaction(transaction);

        if (!result?.success) {
          return { success: false };
        }

        const price24hAgo = await getPrice24hAgo() || result.price;

        return {
          ...result,

          price24hAgo
        };
      }
    },
    PUT: {},
    DELETE: {}
  });
})();
