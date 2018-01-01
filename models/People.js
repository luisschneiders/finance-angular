const bookshelf = require('../config/bookshelf');

const People = bookshelf.Model.extend({
    tableName: 'people',
    hasTimestamps: true,
  },{
    getAll: function(user, status) {
      if (status == 1) {
        return this.where({'peopleInsertedBy': user, 'peopleIsActive': status}).fetchAll();
      }
      return this.where('peopleInsertedBy', user).fetchAll();
    },
    getById: function(user, people) {
      return this.where({'peopleInsertedBy': user, 'id': people}).fetch();
    }
  });

module.exports = People;
