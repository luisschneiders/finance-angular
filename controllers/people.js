const People = require('../models/People');

/**
 * GET /people
 */
exports.peopleGetAll = function(req, res) {
  People.getAll(req.user.id)
    .then(function(people) {
      res.json(people);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * GET /people/:id
 */
exports.peopleGetById = function(req, res) {
  People.getById(req.user.id, req.params.id)
    .then(function(people) {
      res.json(people);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * SAVE /people/new
 * or
 * SAVE /people/:id
 */
exports.peopleSave = function(req, res) {
  let people = null;
  let errors = null;
  let checkRecord = 0;

  req.assert('peopleDescription', 'Description cannot be blank').notEmpty();
  req.assert('peopleType', 'Type cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  checkRecord = new People({id: req.params.id});
  people = new People();

  if(!checkRecord.isNew()) {
    people.save({
        id: req.params.id,
        peopleInsertedBy: req.user.id,
        peopleDescription: req.body.peopleDescription,
        peopleRates: req.body.peopleRates,
        peopleType: req.body.peopleType,
        peopleIsActive: req.body.peopleIsActive,
      }, { patch: true })
      .then(function(model) {
        res.send({ people: model, msg: 'User has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
    return;
  }
  people.save({
      peopleInsertedBy: req.user.id,
      peopleDescription: req.body.peopleDescription,
      peopleRates: req.body.peopleRates,
      peopleType: req.body.peopleType,
      peopleIsActive: req.body.peopleIsActive,
    })
    .then(function(model) {
      res.send({ people: model, msg: 'User has been added.' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
};
