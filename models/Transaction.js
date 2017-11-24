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
      startDate = moment(startDate).format('YYYY-MM-DD');
      endDate = moment(endDate).format('YYYY-MM-DD');

      return this.query(function(qr){
        qr.select('transaction-type.transactionTypeDescription', 'transactions.id', 'transactionType', 'transactionLabel', 'transactionAmount', 'transactionComments', 'transactionDate');
        // qr.sum('transactionAmount AS TotalAmountByTransactionType');
        qr.leftJoin('transaction-type', 'transactions.transactionType', '=', 'transaction-type.id');
        qr.where({'transactionInsertedBy': user, 'transactionFlag': 'r'});
        qr.whereBetween('transactionDate', [startDate, endDate]);
        qr.whereRaw('(transactionAction <> "D" OR transactionLabel <> "T")');
        // qr.groupBy('transactionType');
      }).fetchAll();
    },
    transactionGetByCustomSearch: function(user, startDate, endDate, transactionType) {
      let refineTransactionType = [];
      refineTransactionType = transactionType.split(',');

      return this.query(function(qr) {
        qr.select('transaction-type.transactionTypeDescription', 'transactions.id', 'transactionType', 'transactionLabel', 'transactionAmount', 'transactionComments', 'transactionDate');
        qr.leftJoin('transaction-type', 'transactions.transactionType', '=', 'transaction-type.id');
        qr.where({'transactionInsertedBy': user, 'transactionFlag': 'r'});
        qr.whereBetween('transactionDate', [startDate, endDate]);
        qr.whereIn('transactionType', refineTransactionType);
      }).fetchAll();
    }    
  });

module.exports = Transaction;
