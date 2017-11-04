INSERT INTO `finance-angular`.`people`(
  `id`,
  `peopleDescription`,
  `peopleRates`,
  `peopleIsActive`,
  `peopleInsertedBy`,
  `created_at`)
SELECT
  `employer_id`,
  `employer_name`,
  `employer_rates`,
  `employer_status`,
  `employer_insertedby`,
  `employer_dateinserted`
FROM `financephonegap`.`employer`
