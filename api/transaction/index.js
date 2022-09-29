const createTransaction = require('./create-transaction');
const getTransaction = require('./get-transaction');
const getTransactions = require('./get-transactions');
const init = require('./init');

(async () => {
  const { transactions } = await init();

  module.exports = {
    createTransaction,
    getTransaction,
    getTransactions,
    transactions
  };
})();
