module.exports = ({ transactionApi, priceApi }) => ({
  hash,
  next,
  senderAddress,
  recipientAddress,
  contract,
  usdValue,
  drvValue,
  status
}) => onTransaction({
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
});