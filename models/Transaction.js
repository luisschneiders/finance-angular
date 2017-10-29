const bookshelf = require('../config/bookshelf');

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
    }    
  });

module.exports = Transaction;
