const Bank = require('../models/Bank');

/**
 * GET /banks
 */
exports.bankGet = function(req, res) {
  Bank.fetchAll().then(function(bank) {
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
