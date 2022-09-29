const dss = require('diamond-search-and-store');
const { LinkedList } = require('crypto-linked-list');

module.exports = async () => {
  const transactions = new LinkedList();

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

  // eslint-disable-next-line no-param-reassign
  result = result?.data?.data || [];

  if (result?.length) {
    result.forEach(transactions.add);

    console.log('<DRV> :: Transactions loaded.');
  }

  return {
    transactions
  };
};
