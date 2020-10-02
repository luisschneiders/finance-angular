const bookshelf = require('../config/bookshelf');

const Trip = bookshelf.Model.extend({
    tableName: 'trip',
    hasTimestamps: true,
  },{
    getAllTripsByMonth: function(user, startDate, endDate) {
    },
    getAllTripsByYear: function(user, startDate, endDate) {
    }
  });

module.exports = Trip;
