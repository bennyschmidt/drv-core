const dss = require('diamond-search-and-store');

module.exports = async transactions => {
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
};
