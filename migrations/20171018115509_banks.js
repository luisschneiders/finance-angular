exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('banks', function(table) {
        table.increments();
        table.string('bankDescription');
        table.string('bankAccount').unique();
        table.decimal('bankInitialBalance', [10],[2]);
        table.decimal('bankCurrentBalance', [10],[2]);
        table.boolean('bankIsActive').defaultTo(1);
        table.integer('bankInsertedBy');
        table.timestamps();
      })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('banks')
    ])
};
  