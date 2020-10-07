const bookshelf = require('../config/bookshelf');

const Trip = bookshelf.Model.extend({
    tableName: 'trip',
    hasTimestamps: true,
  },{
    getAllTripsByMonth: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('trip.*');
        qr.where({'tripInsertedBy': user, 'tripFlag': 'r'});
        qr.whereBetween('tripDate', [startDate, endDate]);
      }).fetchAll();
    }
  });

module.exports = Trip;
