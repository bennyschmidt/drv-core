const { transactions } = require('..');

module.exports = index => (
  transactions && transactions.itemAt(index).data
);
