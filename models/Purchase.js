const bookshelf = require('../config/bookshelf');
const moment = require('moment');

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
    },
    getPurchaseByYearAndMonth: function(user, startDate, endDate) {
      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');

      return this.query(function(qr){
        qr.select('expense-type.expenseTypeDescription', 'purchase.id', 'purchaseExpenseId', 'purchaseAmount', 'purchaseComments', 'purchaseDate');
        qr.leftJoin('expense-type', 'purchase.purchaseExpenseId', '=', 'expense-type.id');
        qr.where({'purchaseInsertedBy': user, 'purchaseFlag': 'r'});
        qr.whereBetween('purchaseDate', [startDate, endDate]);
      }).fetchAll();
    }    
  });

module.exports = Purchase;
