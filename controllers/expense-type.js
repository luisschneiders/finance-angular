const ExpenseType = require('../models/Expense-Type');

/**
 * GET /expenses-type
 */
exports.expenseTypeGetAll = function(req, res) {
  ExpenseType.getAll(req.user.id)
  .then(function(expenseType) {
    res.json(expenseType);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * GET /expenses-type/:id
 */
exports.expenseTypeGetById = function(req, res) {
  ExpenseType.getById(req.user.id, req.params.id)
  .then(function(expenseType) {
    res.json(expenseType);
  }).catch(function(err) {
    console.error(err);
  });
};

/**
 * PUT /expenses-type/:id
 */
exports.expenseTypePut = function(req, res) {
  let expenseType;
  let errors;

  req.assert('expenseTypeDescription', 'Description cannot be blank').notEmpty();
  
  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  expenseType = new ExpenseType({'expenseTypeInsertedBy': req.user.id, 'id': req.body.id});
  expenseType.save({
    expenseTypeDescription: req.body.expenseTypeDescription,
    expenseTypeIsActive: req.body.expenseTypeIsActive,
  }, { patch: true })
      .then(function(model) {
        res.send({ expenseType: model, msg: 'Expense has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
};

/**
 * POST /expenses-type/new
 */
exports.expenseTypePost = function(req, res) {
  let expenseType;
  let errors;

  req.assert('expenseTypeDescription', 'Description cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  expenseType = new ExpenseType();
  expenseType.save({
        expenseTypeInsertedBy: req.user.id,
        expenseTypeDescription: req.body.expenseTypeDescription,
        expenseTypeIsActive: req.body.expenseTypeIsActive,
      })
      .then(function(model) {
        res.send({ expenseType: model, msg: 'Expense has been added.' });
      })
      .catch(function(err) {
        return res.status(400).send({ msg: 'Error adding Expense.' });
      });
};
