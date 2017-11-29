const bookshelf = require('../config/bookshelf');

const ExpenseType = bookshelf.Model.extend({
    tableName: 'expense-type',
    hasTimestamps: true,
  },{
    getAll: function(user, status) {
      if (status == 1) {
        return this.where({'expenseTypeInsertedBy': user, 'expenseTypeIsActive': status}).fetchAll();
      }
      return this.where('expenseTypeInsertedBy', user).fetchAll();
    },
    getById: function(user, expenseType) {
      return this.where({'expenseTypeInsertedBy': user, 'id': expenseType}).fetch();
    }
  });

module.exports = ExpenseType;
