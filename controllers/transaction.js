const moment = require('moment');
const Transaction = require('../models/Transaction');

/**
 * GET /transaction
 */
exports.transactionGetByYear = function(req, res) {
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
 * GET /transaction/:year/:month
 */
exports.transactionGetByYearAndMonth = function(req, res) {
  let startDate = null;
  let endDate = null;

  startDate = `${req.params.year}-${req.params.month}-01`;
  startDate = new Date(startDate);

  startDate = moment(startDate);
  endDate = moment(startDate).endOf('month');

  console.log('startDate', startDate);
  console.log('endDate', endDate);
  Transaction.getTransactionByYearAndMonth(req.user.id, startDate, endDate)
    .then(function(transactions) {
      res.json(transactions);
    }).catch(function(err) {
      console.error(err);
    });
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
