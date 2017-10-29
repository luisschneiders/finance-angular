INSERT INTO `finance-angular`.`purchase`(
  `id`,
  `purchaseDate`,
  `purchaseBank`,
  `purchaseExpenseId`,
  `purchaseAmount`,
  `purchaseComments`,
  `purchaseTransactionId`,
  `purchaseInsertedBy`,
  `purchaseFlag`,
  `created_at`) 
SELECT
  `purchase_id`,
  `purchase_date`,
  `purchase_bank`, 
  `purchase_expenseid`,
  `purchase_amount`,
  `purchase_comments`,
  `purchase_transactionid`,
  `purchase_insertedby`,
  `purchase_flag`,
  `purchase_dateinserted`
FROM `financephonegap`.`purchase`
