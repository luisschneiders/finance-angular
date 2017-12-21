const Bank = require('../models/Bank');

/**
 * GET /banks
 */
exports.bankGetAll = function(req, res) {
  Bank.getAll(req.user.id, req.params.isActive)
    .then(function(banks) {
      res.json(banks);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /banks/:id
 */
exports.bankGetById = function(req, res) {
  Bank.getById(req.user.id, req.params.id)
    .then(function(bank) {
      res.json(bank);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * PUT /banks/:id
 */
exports.bankPut = function(req, res) {
  let bank = null;
  let errors = null;

  req.assert('bankDescription', 'Description cannot be blank').notEmpty();
  req.assert('bankAccount', 'Account cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  bank = new Bank({'bankInsertedBy': req.user.id, 'id': req.body.id});
  bank.save({
    bankDescription: req.body.bankDescription,
    bankAccount: req.body.bankAccount,
    bankCurrentBalance: req.body.bankCurrentBalance,
    bankIsActive: req.body.bankIsActive,
  }, { patch: true })
      .then(function(model) {
        res.send({ bank: model, msg: 'Bank has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
};

/**
 * POST /banks/new
 */
exports.bankPost = function(req, res) {
  let bank = null;
  let errors = null;

  req.assert('bankDescription', 'Description cannot be blank').notEmpty();
  req.assert('bankAccount', 'Account cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  bank = new Bank();
  bank.save({
        bankInsertedBy: req.user.id,
        bankDescription: req.body.bankDescription,
        bankAccount: req.body.bankAccount,
        bankInitialBalance: req.body.bankCurrentBalance,
        bankCurrentBalance: req.body.bankCurrentBalance,
        bankIsActive: req.body.bankIsActive,
      })
      .then(function(model) {
        res.send({ bank: model, msg: 'Bank has been added.' });
      })
      .catch(function(err) {
        if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
          return res.status(400).send({ msg: 'The account you have entered already exists.' });
        }
      });
};
