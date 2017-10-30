INSERT INTO `finance-angular`.`expense-type`(
  `id`,
  `expenseTypeDescription`,
  `expenseTypeInsertedBy`,
  `created_at`) 
SELECT
  `expensetype_id`,
  `expensetype_description`,
  `expensetype_insertedby`,
  `expensetype_dateinserted`
FROM `financephonegap`.`expensetype`
