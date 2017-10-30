const bookshelf = require('../config/bookshelf');

const ExpenseType = bookshelf.Model.extend({
    tableName: 'expense-type',
    hasTimestamps: true,
  },{
    getAll: function(user) {
      return this.where('expenseTypeInsertedBy', user).fetchAll();
    },
    getById: function(user, expenseType) {
      return this.where({'expenseTypeInsertedBy': user, 'id': expenseType}).fetch();
    }
  });

module.exports = ExpenseType;
