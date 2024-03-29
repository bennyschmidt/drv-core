/* eslint-disable no-magic-numbers */

const { http } = require('node-service-library');
const { LinkedList } = require('crypto-linked-list');
const { generateUUID } = require('cryptography-utilities');

const { ZERO } = require('./numbers');

const {
  RECORD,
  NON_FUNGIBLE_RECORD
} = require('./strings');

const transactions = new LinkedList();

require('./api/transaction/load-transactions')(transactions);

const transactionApi = require('./api/transaction')(transactions);
const priceApi = require('./api/price');
const fsApi = require('./api/fs');

const onTransaction = require('./events/create-on-transaction')({
  transactionApi,
  priceApi
});

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
      const price24hAgo = await getPrice24hAgo();

      return {
        price,
        price24hAgo: price24hAgo || price
      };
    },
    transactions: transactionApi.getTransactions
  },
  POST: {
    search: fsApi.search,
    store: fsApi.store,
    transaction: async ({
      senderAddress,
      recipientAddress,
      usdValue,
      drvValue,
      contract = RECORD,
      peers = [],
      isTest = false
    }) => {
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

      if (isTest) {
        return {
          success: true
        };
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
