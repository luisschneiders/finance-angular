-- SELECT * FROM `timesheets` 
-- WHERE `timesheetEndDate` is null
-- OR
-- `timesheetEndDate` != `timesheetStartDate`
-- ORDER BY `timesheetEndDate` ASC;


-- SELECT * FROM `timesheets` 
-- WHERE `ID`
-- BETWEEN 14 AND 579;


/* STEP 01 */
UPDATE `timesheets` SET `timesheetEndDate` = `timesheetStartDate` 
WHERE `timesheetStartDate` != `timesheetEndDate`
OR `timesheetEndDate` IS NULL;

/* STEP 02 */
UPDATE `timesheets` SET 
`timesheetStartDate` = TIMESTAMP(`timesheetStartDate`,`timesheetTimeIn`),
`timesheetEndDate` = TIMESTAMP(`timesheetEndDate`,`timesheetTimeOut`)
WHERE `id` > 0;
