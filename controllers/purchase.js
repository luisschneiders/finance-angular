const moment = require('moment');
const async = require('async');
const Bank = require('../models/Bank');
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');

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
 * POST /purchases/new
 */
exports.purchasePost = function(req, res) {
  let errors = null;
  let data = {};

  req.assert('purchaseBank', 'Bank cannot be blank').notEmpty();
  req.assert('purchaseExpenseId', 'Expense cannot be blank').notEmpty();
  req.assert('purchaseDate', 'Date cannot be blank').notEmpty();
  req.assert('purchaseComments', 'Comments cannot be blank').notEmpty();
  req.assert('purchaseAmount', 'Amount cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  data = {
    purchaseInsertedBy: req.user.id,
    purchaseDate: req.body.purchaseDate,
    purchaseBank: req.body.purchaseBank,
    purchaseExpenseId: req.body.purchaseExpenseId,
    purchaseComments: req.body.purchaseComments,
    purchaseAmount: req.body.purchaseAmount,
  }

  function updateBankBalance() {
    return new Promise(function(resolve, reject) {
      Bank.getById(data.purchaseInsertedBy, data.purchaseBank)
        .then(function() {
          let bank = null;
          // check if there is enough funds
          if (parseFloat(this.attributes.bankCurrentBalance) < parseFloat(data.purchaseAmount)) {
            reject({msg: 'Insufficient funds!'});
            return;
          }
          // update bank's current balance
          bank = new Bank();
          bank.save({
              id: data.purchaseBank,
              bankCurrentBalance: (this.attributes.bankCurrentBalance - data.purchaseAmount),
            }, { patch: true })
            .then(function(model) {
              resolve();
            }).catch(function(err) {
              reject(err);
            });
        }).catch(function(err) {
          reject(err);
        });
    });
  };

  function saveTransaction() {
    return new Promise(function(resolve, reject) {
      let transaction = new Transaction();
      transaction.save({
        transactionLink: null,
        transactionDate: data.purchaseDate,
        transactionFromBank: data.purchaseBank,
        transactionToBank: 0,
        transactionType: 0, // purchase
        transactionAction: 'D',
        transactionLabel: 'D',
        transactionAmount: data.purchaseAmount,
        transactionComments: data.purchaseComments,
        transactionInsertedBy: data.purchaseInsertedBy,
        transactionFlag: 'r'
        })
        .then(function(model) {
          resolve(model.id);
        }).catch(function(err) {
          reject(err);
        });
    });
  };

  function savePurchase(transactionID) {
    return new Promise(function(resolve, reject) {
      let purchase =  new Purchase();
      purchase.save({
        purchaseDate: data.purchaseDate,
        purchaseBank: data.purchaseBank,
        purchaseExpenseId: data.purchaseExpenseId,
        purchaseAmount: data.purchaseAmount,
        purchaseComments: data.purchaseComments,
        purchaseTransactionId: transactionID,
        purchaseInsertedBy: data.purchaseInsertedBy,
        purchaseFlag: 'r'
      })
      .then(function(model) {
        resolve();
      }).catch(function(err) {
        reject(err);
      });
    });
  };

  async function transaction() {
    try {
      let updateBalance = await updateBankBalance();
      let transactionID = await saveTransaction();
      let purchase = await savePurchase(transactionID);
      res.status(200).send({msg: 'Purchase Saved!'})
    } catch(error) {
      console.error(error);
      res.status(400).send(error);
    }
  }
  transaction();
};
