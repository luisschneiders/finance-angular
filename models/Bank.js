const bookshelf = require('../config/bookshelf');

const Bank = bookshelf.Model.extend({
    tableName: 'banks',
    hasTimestamps: true,
  },{
    getAll: function(user, status) {
      if (status == 1) {
        return this.where({'bankInsertedBy': user, 'bankIsActive': status}).fetchAll();
      }
      return this.where('bankInsertedBy', user).fetchAll();
    },
    getById: function(user, bank) {
      return this.where({'bankInsertedBy': user, 'id': bank}).fetch();
    },
    updateBalance: function(data) {
      return this.update(function(qr) {
        qr.where({'bankInsertedBy': data.purchaseInsertedBy, 'id': data.purchaseBank, 'bankCurrentBalance': data.purchaseAmount});
      })
    }
  });

module.exports = Bank;
