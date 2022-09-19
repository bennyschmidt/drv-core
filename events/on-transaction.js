const onValuation = require('./on-valuation');

module.exports = async ({
  transactionApi,
  priceApi,
  hash,
  next,
  senderAddress,
  recipientAddress,
  contract,
  usdValue,
  drvValue,
  status
}) => {
  const transaction = {
    hash,
    next,
    senderAddress,
    recipientAddress,
    contract,
    usdValue,
    drvValue,
    status
  };

  const { price } = await onValuation({
    priceApi,

    ...transaction
  });

  transaction.price = price;

  const success = await transactionApi.createTransaction(transaction);

  if (!success) return;

  const marketCap = await priceApi.getMarketCap();

  return {
    success,
    price,
    marketCap
  };
};
