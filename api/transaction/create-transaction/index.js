/* eslint-disable no-magic-numbers */

const dss = require('diamond-search-and-store');

const { transactions } = require('..');

module.exports = async ({
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
