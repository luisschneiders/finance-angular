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
      let options = null;

      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');
      options = new Options(user, startDate, endDate);

      return this.query(function(qr){
        queryPurchases(qr, options);
      }).fetchAll();
    },
    getPurchaseByCustomSearch: function(user, startDate, endDate, expenseType) {
      let options = new Options(user, startDate, endDate);
      let refineExpenseType = [];
      let allExpensesType = 'all';

      refineExpenseType = expenseType.split(',');

      return this.query(function(qr){
        queryPurchases(qr, options);
        if (refineExpenseType[0] !== allExpensesType) {
          qr.whereIn('purchaseExpenseId', refineExpenseType);
        }
      }).fetchAll();
    }
  });
class Options {
  constructor(user, startDate, endDate) {
    this.user = user;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
function queryPurchases(qr, options) {
  qr.select('expense-type.expenseTypeDescription', 'banks.bankDescription', 'purchase.id', 'purchaseExpenseId', 'purchaseAmount', 'purchaseComments', 'purchaseDate');
  qr.leftJoin('expense-type', 'purchase.purchaseExpenseId', '=', 'expense-type.id');
  qr.leftJoin('banks', 'purchase.purchaseBank', '=', 'banks.id');
  qr.where({'purchaseInsertedBy': options.user, 'purchaseFlag': 'r'});
  qr.whereBetween('purchaseDate', [options.startDate, options.endDate]);
  return qr;
};

module.exports = Purchase;
