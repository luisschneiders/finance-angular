const bookshelf = require('../config/bookshelf');

const Bank = bookshelf.Model.extend({
    tableName: 'banks',
    hasTimestamps: true,
  },{
    getAll: function(user) {
      return this.where('bankInsertedBy', user).fetchAll();
    },
    getById: function(user, bank) {
      return this.where({'bankInsertedBy': user, 'id': bank}).fetch();
    }
  });

module.exports = Bank;
