module.exports = transactions => () => {
  if (!transactions) return [];

  let tail = transactions.head;

  if (!tail) return [];

  if (!tail.next) return [tail.data];

  let transactionsArray = [];

  while (tail.next) {
    transactionsArray.push(tail.data);

    tail = tail.next;
  }

  transactionsArray.push(tail.data);

  return transactionsArray;
};
