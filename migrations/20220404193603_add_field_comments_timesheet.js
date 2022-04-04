exports.up = function(knex) {
    return Promise.all([
      knex.schema.table('timesheets', function(table) {
        table.string('timesheetComments');
      })
    ]);
  };

  exports.down = function(knex) {};
