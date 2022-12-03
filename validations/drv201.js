/*
Validations.nonFungibleRecord
 */

module.exports = ({ drvValue }) => (
  typeof (drvValue) !== 'number'
);
