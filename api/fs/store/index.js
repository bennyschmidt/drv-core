/* eslint-disable no-magic-numbers */

const dss = require('diamond-search-and-store');

module.exports = async ({ content }) => (
  dss.onHttpPost(
    {
      method: 'store',
      body: {
        media: content,
        mediaType: 'json'
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
  )
);
