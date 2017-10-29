const bookshelf = require('../config/bookshelf');

const Purchase = bookshelf.Model.extend({
    tableName: 'purchase',
    hasTimestamps: true
  },{
    getPurchaseByYear: function(user, startDate, endDate) {
      // return this.query(function(qr) {
      //   qr.select('transactionDate', 'transactionLabel', 'transactionAmount', 'transactionFlag');
      //   qr.sum('transactionAmount AS TotalAmountByLabel');
      //   qr.where({'transactionInsertedBy': user, 'transactionFlag': 'r'});
      //   qr.whereBetween('transactionDate', [startDate, endDate]);
      //   qr.groupBy('transactionLabel');
      // }).fetchAll();
    }    
  });

module.exports = Purchase;
