const onValuation = require('./onValuation');

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

  const { price } = await onValuation(transaction);

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
