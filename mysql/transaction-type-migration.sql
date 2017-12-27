-- active
INSERT INTO `finance-angular`.`transaction-type`(
  `id`,
  `transactionTypeDescription`,
  `transactionTypeAction`,
  `transactionTypeInsertedBy`,
  `created_at`,
  `transactionTypeIsActive`) 
SELECT
  b.`transactiontype_id`,
  b.`transactiontype_name`,
  b.`transactiontype_action`,
  b.`transactiontype_insertedby`,
  b.`transactiontype_dateinserted`,
  1
FROM `financephonegap`.`transactiontype` b
WHERE b.`transactiontype_status` = 'a'

-- inactive
INSERT INTO `finance-angular`.`transaction-type`(
  `id`,
  `transactionTypeDescription`,
  `transactionTypeAction`,
  `transactionTypeInsertedBy`,
  `created_at`,
  `transactionTypeIsActive`) 
SELECT
  b.`transactiontype_id`,
  b.`transactiontype_name`,
  b.`transactiontype_action`,
  b.`transactiontype_insertedby`,
  b.`transactiontype_dateinserted`,
  0
FROM `financephonegap`.`transactiontype` b
WHERE b.`transactiontype_status` = 'i'
