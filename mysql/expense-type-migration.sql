-- active
INSERT INTO `finance-angular`.`expense-type`(
  `id`,
  `expenseTypeDescription`,
  `expenseTypeInsertedBy`,
  `created_at`,
  `expenseTypeIsActive`) 
SELECT
  b.`expensetype_id`,
  b.`expensetype_description`,
  b.`expensetype_insertedby`,
  b.`expensetype_dateinserted`,
  1
FROM `financephonegap`.`expensetype` b
WHERE b.`expensetype_status` = 'a'

-- inactive
INSERT INTO `finance-angular`.`expense-type`(
  `id`,
  `expenseTypeDescription`,
  `expenseTypeInsertedBy`,
  `created_at`,
  `expenseTypeIsActive`) 
SELECT
  b.`expensetype_id`,
  b.`expensetype_description`,
  b.`expensetype_insertedby`,
  b.`expensetype_dateinserted`,
  0
FROM `financephonegap`.`expensetype` b
WHERE b.`expensetype_status` = 'i'
