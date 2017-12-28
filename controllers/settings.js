const fs = require('fs');
/**
 * GET /settings
 */
exports.settingsGet = function(req, res) {
  let settings = fs.readFileSync('./settings/app.json');
  // let year = req.params.year;
  // let startDate = `${year}-01-01`;
  // let endDate = `${year}-12-31`;
  // let user = req.user.id;

  // async.parallel([
  //   function(callback) {
  //     Transaction.getTransactionByYear(user, startDate, endDate)
  //     .then(function(transactions) {
  //       callback(null, transactions);
  //     }).catch(function(err) {
  //       console.error(err);
  //     });      
  //   },
  //   function(callback) {
  //     Purchase.getPurchaseByYear(user, startDate, endDate)
  //     .then(function(purchases) {
  //       callback(null, purchases);
  //     }).catch(function(err) {
  //       console.error(err);
  //     });      
  //   }
  // ], function(err, results) {
  //     res.json(results);
  // });  
};
