const Bank = require('../models/Bank');

/**
 * GET /banks
 */
exports.bankGetAll = function(req, res) {
  Bank.where('bankInsertedBy', req.user.id).fetchAll().then(function(banks) {
    res.json(banks);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * GET /bank/:id
 */
exports.bankGetById = function(req, res) {
  Bank.where({'bankInsertedBy': req.user.id, 'id': req.params.id}).fetch().then(function(bank) {
    res.json(bank);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * POST /bank
 */
exports.bankPost = function(req, res) {

};

/**
 * PUT /bank:id
 */
exports.bankPut = function(req, res) {
  
};
