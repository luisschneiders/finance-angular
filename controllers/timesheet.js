const Timesheets = require('../models/Timesheet');
const moment = require('moment');

/**
 * GET /get-all-timesheets-month/:year-month
 */
exports.getAllTimesheets = function(req, res) {
  let user = req.user.id;
  let period = req.params.period;
  let startDate = moment(period).startOf('month').format('YYYY-MM-DD');
  let endDate = moment(period).endOf('month').format('YYYY-MM-DD')


  Timesheets.getAllTimesheets(user, startDate, endDate)
    .then(function(timesheets) {
      res.json(timesheets);
    }).catch(function(err) {
      console.error(err);
    });
};
