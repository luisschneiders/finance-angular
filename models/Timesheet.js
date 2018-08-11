const bookshelf = require('../config/bookshelf');

const Timesheets = bookshelf.Model.extend({
    tableName: 'timesheets',
    hasTimestamps: true,
  },{
    getAllTimesheets: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('people.peopleDescription', 'timesheets.*');
        qr.leftJoin('people', 'timesheets.timesheetEmployer', '=', 'people.id');
        qr.where({'timesheetInsertedBy': user, 'timesheetFlag': 'r'});
        qr.whereBetween('timesheetStartDate', [startDate, endDate]);
      }).fetchAll();
    },
    // getActiveBanks: function(user) {
    //   return this.where({'bankInsertedBy': user, 'bankIsActive': 1}).fetchAll();
    // },
    // getById: function(user, bank) {
    //   return this.where({'bankInsertedBy': user, 'id': bank}).fetch();
    // },
    // updateBalance: function(data) {
    //   return this.update(function(qr) {
    //     qr.where({'bankInsertedBy': data.purchaseInsertedBy, 'id': data.purchaseBank, 'bankCurrentBalance': data.purchaseAmount});
    //   })
    // }
  });

module.exports = Timesheets;
