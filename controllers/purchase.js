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
