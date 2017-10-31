const TransactionType = require('../models/Transaction-Type');

/**
 * GET /transactions-type
 */
exports.transactionTypeGetAll = function(req, res) {
  TransactionType.getAll(req.user.id)
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
 * PUT /transactions-type/:id
 */
exports.transactionTypePut = function(req, res) {
  let transactionType;
  let errors;

  req.assert('transactionTypeDescription', 'Description cannot be blank').notEmpty();
  req.assert('transactionTypeAction', 'Type cannot be blank').notEmpty();
  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  transactionType = new TransactionType({'transactionTypeInsertedBy': req.user.id, 'id': req.body.id});
  transactionType.save({
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
};

/**
 * POST /transactions-type/new
 */
exports.transactionTypePost = function(req, res) {
  let transactionType;
  let errors;

  req.assert('transactionTypeDescription', 'Description cannot be blank').notEmpty();
  req.assert('transactionTypeAction', 'Type cannot be blank').notEmpty();
  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  transactionType = new TransactionType();
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
        return res.status(400).send({ msg: 'Error adding transaction.' });
      });
};
