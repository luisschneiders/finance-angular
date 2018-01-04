-- active
INSERT INTO `finance-angular`.`people`(
  `id`,
  `peopleDescription`,
  `peopleRates`,
  `peopleInsertedBy`,
  `created_at`,
  `peopleIsActive`,
  `peopleType`)
SELECT
  b.`employer_id`,
  b.`employer_name`,
  b.`employer_rates`,
  b.`employer_insertedby`,
  b.`employer_dateinserted`,
  1,
  1
FROM `financephonegap`.`employer` b
WHERE b.`employer_status` = 'a'

-- inactive
INSERT INTO `finance-angular`.`people`(
  `id`,
  `peopleDescription`,
  `peopleRates`,
  `peopleInsertedBy`,
  `created_at`,
  `peopleIsActive`,
  `peopleType`)
SELECT
  b.`employer_id`,
  b.`employer_name`,
  b.`employer_rates`,
  b.`employer_insertedby`,
  b.`employer_dateinserted`,
  0,
  1
FROM `financephonegap`.`employer` b
WHERE b.`employer_status` = 'i'
