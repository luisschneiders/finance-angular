const moment = require('moment');
const Purchase = require('../models/Purchase');

/**
 * GET /purchases
 */
exports.purchasesGetByYear = function(req, res) {
  let year = req.params.id;
  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-31`;
  Purchase.getPurchaseByYear(req.user.id, startDate, endDate)
    .then(function(purchases) {
      res.json(purchases);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /purchase/:year/:month
 */
exports.purchaseGetByYearAndMonth = function(req, res) {
  let startDate = null;
  let endDate = null;

  startDate = `${req.params.year}-${req.params.month}-01`;
  startDate = new Date(startDate);
// we use moment to set both startDate and endDate in the same format.
  startDate = moment(startDate);
  endDate = moment(startDate).endOf('month');

  Purchase.getPurchaseByYearAndMonth(req.user.id, startDate, endDate)
    .then(function(purchases) {
      res.json(purchases);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /purchases-by-custom-search/:from&:to&:expenseType
 */
exports.purchaseGetByCustomSearch = function(req, res) {
  let startDate = null;
  let endDate = null;
  let expenseType = null;

  startDate = req.params.from;
  endDate = req.params.to;
  expenseType = req.params.expenseType;

  Purchase.getPurchaseByCustomSearch(req.user.id, startDate, endDate, expenseType)
    .then(function(purchases) {
      res.json(purchases);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /purchases/:id
 */
exports.transactionGetById = function(req, res) {

};

/**
 * PUT /purchases/:id
 */
exports.transactionPut = function(req, res) {

};

/**
 * POST /purchases/new
 */
exports.transactionPost = function(req, res) {

};
