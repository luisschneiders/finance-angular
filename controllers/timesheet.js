const Timesheet = require('../models/Timesheet');
const moment = require('moment');

/**
 * GET /get-all-timesheets-month/:year-month
 */
exports.getAllTimesheets = function(req, res) {
  let user = req.user.id;
  let period = req.params.period;
  let startDate = moment(period).startOf('month').format('YYYY-MM-DD');
  let endDate = moment(period).endOf('month').format('YYYY-MM-DD')


  Timesheet.getAllTimesheets(user, startDate, endDate)
    .then(function(timesheets) {
      res.json(timesheets);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * POST /timesheets/new
 */
exports.saveTimesheet = function(req, res) {
  let errors = null;
  let isValidTime = false;
  
  req.assert('timesheetStartDate', 'Date cannot be blank').notEmpty();
  req.assert('timesheetEmployer', 'Employer cannot be blank').notEmpty();
  req.assert('timesheetTimeIn', 'Punch In cannot be blank').notEmpty();
  req.assert('timesheetTimeOut', 'Punch Out cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  isValidTime = checkTime();

  if (!isValidTime) {
    // res.json({msg: 'Incorrect Time format!'});
    res.status(400).send({msg: 'Incorrect Time format!'});
    return;
  };

  if (req.body.timesheetTimeIn >= req.body.timesheetTimeOut) {
    res.json({msg: `Punch Out ${moment(req.body.timesheetTimeOut).format('hh:mm a')} must be higher than Punch In ${moment(req.body.timesheetTimeIn).format('hh:mm a')}
    for the period, please check!`});
    return;
  }

  res.json({msg: 'Saved!'});
  return;

  bank.save({
      timesheetInsertedBy: req.user.id,
      timesheetEmployer: req.body.timesheetEmployer,
      timesheetStartDate: req.body.timesheetStartDate,
      timesheetTimeIn: req.body.timesheetTimeIn,
      timesheetTimeOut: req.body.timesheetTimeOut,
      timesheetTimeBreak: req.body.timesheetTimeBreak,
      timesheetHourly: req.body.timesheetHourly,
      timesheetTotal: req.body.timesheetTotal,
      timesheetTotalhours: req.body.timesheetTotalhours,
      timesheetStatus: req.body.timesheetStatus,
      timesheetFlag: req.body.timesheetFlag,
    })
    .then(function(model) {
      res.send({ bank: model, msg: 'Timesheet has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });

  function checkTime() {
    console.log('req.body.timesheetTimeIn', req.body.timesheetTimeIn);
    let punchIn = moment(req.body.timesheetTimeIn).format('hh:mm:ss');
    let punchOut = moment(req.body.timesheetTimeOut).format('hh:mm:ss');
    let timeBreak = true;

    if (req.body.timesheetTimeBreak) {
      timeBreak = moment(req.body.timesheetTimeBreak, 'hh:mm:ss', true).isValid();
    }
    console.log('punchIn', punchIn, 'punchOut', punchOut, 'timeBreak', timeBreak )
    if (punchIn && punchOut && timeBreak) {
      return true;
    }

    return false;
  }
}
