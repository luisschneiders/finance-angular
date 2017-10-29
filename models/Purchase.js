const bookshelf = require('../config/bookshelf');

const Purchase = bookshelf.Model.extend({
    tableName: 'purchase',
    hasTimestamps: true
  },{
    getPurchaseByYear: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('purchaseExpenseId', 'purchaseAmount', 'purchaseInsertedBy', 'purchaseDate');
        qr.sum('purchaseAmount AS TotalAmountByMonth');
        qr.where({'purchaseInsertedBy': user, 'purchaseFlag': 'r'});
        qr.whereBetween('purchaseDate', [startDate, endDate]);
        qr.groupByRaw('month (purchaseDate)');
      }).fetchAll();
    }    
  });

module.exports = Purchase;
