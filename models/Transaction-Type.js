const bookshelf = require('../config/bookshelf');

const TransactionType = bookshelf.Model.extend({
    tableName: 'transaction-type',
    hasTimestamps: true,
  },{
    getAll: function(user, status) {
      if(status == 1) {
        return this.where({'transactionTypeInsertedBy': user, 'transactionTypeIsActive': status}).fetchAll();
      }
      return this.where('transactionTypeInsertedBy', user).fetchAll();
    },
    getById: function(user, transactionType) {
      return this.where({'transactionTypeInsertedBy': user, 'id': transactionType}).fetch();
    }
  });

module.exports = TransactionType;
