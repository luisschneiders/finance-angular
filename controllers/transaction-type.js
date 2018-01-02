const TransactionType = require('../models/Transaction-Type');

/**
 * GET /transactions-type/:isActive
 */
exports.transactionTypeGetAll = function(req, res) {
  TransactionType.getAll(req.user.id, req.params.isActive)
  .then(function(transactionType) {
    res.json(transactionType);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * GET /transactions-type/:id
 */
exports.transactionTypeGetById = function(req, res) {
  TransactionType.getById(req.user.id, req.params.id)
  .then(function(transactionType) {
    res.json(transactionType);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * SAVE /transaction-type/new
 * or
 * SAVE /transaction-type/:id
 */
exports.transactionTypeSave = function(req, res) {
  let transactionType = null;
  let errors = null;
  let checkRecord = 0;

  req.assert('transactionTypeDescription', 'Description cannot be blank').notEmpty();
  req.assert('transactionTypeAction', 'Type cannot be blank').notEmpty();
  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new TransactionType({id: req.params.id});
  transactionType = new TransactionType();

  if(!checkRecord.isNew()) {
    transactionType.save({
      id: req.params.id,
      transactionTypeInsertedBy: req.user.id,
      transactionTypeDescription: req.body.transactionTypeDescription,
      transactionTypeAction: req.body.transactionTypeAction,
      transactionTypeIsActive: req.body.transactionTypeIsActive,
    }, { patch: true })
      .then(function(model) {
        res.send({ transactionType: model, msg: 'Transaction type has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  transactionType.save({
      transactionTypeInsertedBy: req.user.id,
      transactionTypeDescription: req.body.transactionTypeDescription,
      transactionTypeAction: req.body.transactionTypeAction,
      transactionTypeIsActive: req.body.transactionTypeIsActive,
    })
    .then(function(model) {
      res.send({ transactionType: model, msg: 'Transaction type has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};