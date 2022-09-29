module.exports = transactions => index => (
  transactions && transactions.itemAt(index).data
);
