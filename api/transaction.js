/* eslint-disable no-magic-numbers */

const dss = require('diamond-search-and-store');
const { LinkedList } = require('crypto-linked-list');

let transactions;

(async () => {
  transactions = new LinkedList();

  let result = await dss.onHttpPost(
    {
      method: 'read',
      body: {
        collectionName: 'transactions'
      },
      route: {
        path: 'dss'
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

  result = result?.data?.data?.data || [];

  if (result?.length) {
    result.forEach(transactions.add);

    console.log('<DRV> :: Transactions loaded.');
  }
})();

const getTransactions = () => {
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

const getTransaction = index => (
  transactions && transactions.itemAt(index).data
);

const createTransaction = async ({
  hash,
  next,
  senderAddress,
  recipientAddress,
  contract,
  usdValue,
  drvValue,
  status,
  price
}) => {
  if (!transactions) return;

  const transaction = {
    timestamp: Date.now(),
    hash,
    next,
    senderAddress,
    recipientAddress,
    contract,
    usdValue,
    drvValue,
    status,
    price
  };

  transactions.add(transaction);

  let tail = transactions.head;

  while (tail.next) {
    tail = tail.next;
  }

  await dss.onHttpPost(
    {
      method: 'write',
      body: {
        collectionName: 'transactions',
        payload: tail.data
      },
      route: {
        path: 'dss'
      },
      path: 'write'
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

  console.log(
    `<DRV> :: A transaction was added.`,
    tail.data
  );

  return true;
};

module.exports = () => ({
  getTransactions,
  getTransaction,
  createTransaction
});
