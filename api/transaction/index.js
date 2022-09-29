module.exports = transactions => {
  const createTransaction = require('./create-transaction')(transactions);
  const getTransaction = require('./get-transaction')(transactions);
  const getTransactions = require('./get-transactions')(transactions);

  return {
    createTransaction,
    getTransaction,
    getTransactions
  };
};
