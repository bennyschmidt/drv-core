/* eslint-disable no-magic-numbers */

const {
  STANDARD_DEVIATION,
  ZERO
} = require('../numbers');

const {
  DRV,
  USD,
  RECORD
} = require('../strings');

module.exports = async ({
  priceApi,
  contract,
  drvValue,
  usdValue
}) => {
  const isFungible = contract === RECORD;

  const apiPrice = await priceApi.getPrice();

  const assertedPrice = !isFungible ? usdValue : parseFloat(
    Math.max(
      ZERO,
      usdValue / drvValue
    )
  );

  const isMisvaluation = (
    assertedPrice > (parseFloat(apiPrice) + (apiPrice * STANDARD_DEVIATION)) ||
    assertedPrice < (parseFloat(apiPrice) - (apiPrice * STANDARD_DEVIATION))
  );

  let price = parseFloat(apiPrice);

  if (isFungible) {
    if (isMisvaluation) {
      console.log(
        // eslint-disable-next-line max-len
        `<DRV> :: Assertion Rejected: ${drvValue.toFixed(2)} ${DRV} is not proven to be worth ${(usdValue).toFixed(2)} ${USD} within a standard deviation of ${STANDARD_DEVIATION * 100}%.`
      );

      console.log(
        '<DRV> :: Correcting a misvaluation...'
      );

      const modifier = (
        assertedPrice < apiPrice
          ? (STANDARD_DEVIATION * -1)
          : STANDARD_DEVIATION
      );

      price = parseFloat(
        parseFloat(apiPrice * modifier) +
        parseFloat(apiPrice)
      );

      console.log(
        // eslint-disable-next-line max-len
        `<DRV> :: A corrected proof of value was asserted: "1.00 ${DRV} == ${price.toFixed(2)} ${USD} (adjusted from ${assertedPrice.toFixed(2)} ${USD})".`,
      );
    } else {
      price = usdValue;

      console.log(
        `<DRV> :: A proof of value was asserted: "1.00 ${DRV} == ${price.toFixed(2)} ${USD}".`,
      );
    }
  }

  return {
    price,
    usdValue
  };
};
