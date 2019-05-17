const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const Bank = require('../models/Bank');
const async = require('async');
/**
 * GET /main-by-year/:year
 */
exports.getTransactionsAndPurchasesByYear = function(req, res) {
  let year = req.params.year;
  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-31`;
  let user = req.user.id;

  async.parallel([
    function(callback) {
      Transaction.getTransactionByYear(user, startDate, endDate)
      .then(function(transactions) {
        callback(null, transactions);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Purchase.getPurchaseByYear(user, startDate, endDate)
      .then(function(purchases) {
        callback(null, purchases);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Transaction.getIncomeByYear(user, startDate, endDate)
      .then(function(transactions) {
        callback(null, transactions);
      }).catch(function(err) {
        console.error(err);
      });
    },
    function(callback) {
      Bank.getActiveBanks(user)
      .then(function(banks) {
        callback(null, banks);
      }).catch(function(err) {
        console.error(err);
      })
    }
  ], function(err, results) {
      res.json(results);
  });  
};
