const bookshelf = require('../config/bookshelf');

const People = bookshelf.Model.extend({
    tableName: 'people',
    hasTimestamps: true,
  },{
    getAll: function(user) {
      return this.where('peopleInsertedBy', user).fetchAll();
    },
    getById: function(user, people) {
      return this.where({'peopleInsertedBy': user, 'id': people}).fetch();
    }
  });

module.exports = People;
