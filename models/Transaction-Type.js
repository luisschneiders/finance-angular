const bookshelf = require('../config/bookshelf');

const TransactionType = bookshelf.Model.extend({
    tableName: 'transaction-type',
    hasTimestamps: true,
  },{
    getAll: function(user) {
      return this.where('transactionTypeInsertedBy', user).fetchAll();
    },
    getById: function(user, transactionType) {
      return this.where({'transactionTypeInsertedBy': user, 'id': transactionType}).fetch();
    }
  });

module.exports = TransactionType;
