/* eslint-disable no-magic-numbers */

const getPrice = require('../get-price');
const getInventory = require('../get-inventory');

module.exports = async () => {
  const inventory = await getInventory();
  const price = await getPrice();

  return Math.max(
    0.01,
    (inventory * parseFloat(price)).toFixed(2)
  );
};
