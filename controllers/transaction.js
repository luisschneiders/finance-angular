const Transaction = require('../models/Transaction');

/**
 * GET /transactions
 */
exports.transactionsGetByYear = function(req, res) {
  let year = req.params.id;
  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-31`;
  Transaction.getTransactionByYear(req.user.id, startDate, endDate)
    .then(function(transactions) {
      res.json(transactions);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /transactions/:id
 */
exports.transactionGetById = function(req, res) {

};

/**
 * PUT /transactions/:id
 */
exports.transactionPut = function(req, res) {

};

/**
 * POST /transactions/new
 */
exports.transactionPost = function(req, res) {

};
