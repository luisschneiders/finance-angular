-- active
INSERT INTO `finance-angular`.`banks`(
  `id`,
  `bankDescription`,
  `bankAccount`,
  `bankInitialBalance`,
  `bankCurrentBalance`,
  `bankInsertedBy`,
  `created_at`,
  `bankIsActive`
)
SELECT
  b.`bank_id`,
  b.`bank_description`,
  b.`bank_account`,
  b.`bank_initbalance`,
  b.`bank_actubalance`,
  b.`bank_insertedby`,
  b.`bank_dateinserted`,
  1
FROM `financephonegap`.`bank` b
WHERE b.`bank_status` = 'a'

-- inactive
INSERT INTO `finance-angular`.`banks`(
  `id`,
  `bankDescription`,
  `bankAccount`,
  `bankInitialBalance`,
  `bankCurrentBalance`,
  `bankInsertedBy`,
  `created_at`,
  `bankIsActive`
)
SELECT
  b.`bank_id`,
  b.`bank_description`,
  b.`bank_account`,
  b.`bank_initbalance`,
  b.`bank_actubalance`,
  b.`bank_insertedby`,
  b.`bank_dateinserted`,
  0
FROM `financephonegap`.`bank` b
WHERE b.`bank_status` = 'i'
