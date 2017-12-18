const bookshelf = require('../config/bookshelf');
const moment = require('moment');

const Transaction = bookshelf.Model.extend({
    tableName: 'transactions',
    hasTimestamps: true
  },{
    getTransactionByYear: function(user, startDate, endDate) {
      return this.query(function(qr) {
        qr.select('transactionDate', 'transactionLabel', 'transactionAmount', 'transactionFlag');
        qr.sum('transactionAmount AS TotalAmountByLabel');
        qr.where({'transactionInsertedBy': user, 'transactionFlag': 'r'});
        qr.whereBetween('transactionDate', [startDate, endDate]);
        qr.groupBy('transactionLabel');
      }).fetchAll();
    },
    getTransactionByYearAndMonth: function(user, startDate, endDate) {
      let options = null;

      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');
      options = new Options(user, startDate, endDate);

      return this.query(function(qr){
        queryTransactions(qr, options);
      }).fetchAll();
    },
    transactionGetByCustomSearch: function(user, startDate, endDate, transactionType) {
      let options = new Options(user, startDate, endDate);
      let refineTransactionType = [];
      refineTransactionType = transactionType.split(',');

      return this.query(function(qr) {
        queryTransactions(qr, options);
        qr.whereIn('transactionType', refineTransactionType);
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

function queryTransactions(qr, options) {
  qr.select('transaction-type.transactionTypeDescription', 'transactions.id', 'transactionType', 'transactionLabel', 'transactionAmount', 'transactionComments', 'transactionDate');
  qr.leftJoin('transaction-type', 'transactions.transactionType', '=', 'transaction-type.id');
  qr.where({'transactionInsertedBy': options.user, 'transactionFlag': 'r'});
  qr.whereBetween('transactionDate', [options.startDate, options.endDate]);
  qr.whereRaw('(transactionAction <> "D" OR transactionLabel <> "T")');
  return qr;
};

module.exports = Transaction;
