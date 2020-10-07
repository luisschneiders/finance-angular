const Trip = require('../models/Trip');
const moment = require('moment');

/**
 * GET /get-all-trips-month/:year-month
 */
exports.getAllTripsByMonth = function(req, res) {
  let user = req.user.id;
  let period = req.params.period;
  let startDate = moment(period).startOf('month').format('YYYY-MM-DD');
  let endDate = moment(period).endOf('month').format('YYYY-MM-DD');

  Trip.getAllTripsByMonth(user, startDate, endDate)
    .then(function(trips) {
      res.json(trips);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * POST /trips/new
 */
exports.saveTrip = function(req, res) {
  let errors = null;

}

/**
 * PUT /trips/remove-trip=id
 */
exports.removeTrip = function(req, res) {
  let trip = null;
  let checkRecord = new Trip({id: req.params.id});

  if(!checkRecord.isNew()) {
    trip = new Trip();
    trip.save({
      id: req.params.id,
      tripFlag: 'd',
    }, { patch: true })
    .then(function(model) {
      res.send({ trip: model, msg: 'Trip status has been removed.' });
    })
    .catch(function(err) {
      res.send({ msg: err });
    });
  }
}
