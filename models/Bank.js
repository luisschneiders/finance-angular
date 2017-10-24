const bookshelf = require('../config/bookshelf');

const Bank = bookshelf.Model.extend({
  tableName: 'banks',
  hasTimestamps: true
});

module.exports = Bank;
