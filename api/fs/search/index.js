/* eslint-disable no-magic-numbers */

const dss = require('diamond-search-and-store');

module.exports = async ({
  mediaAddress,
  mediaType
}) => (
  dss.onHttpPost(
    {
      method: 'search',
      body: {
        mediaAddress,
        mediaType
      },
      route: {
        path: 'dss'
      },
      path: 'search'
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
  )
);
