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
 * PUT /people/:id
 */
exports.peoplePut = function(req, res) {
  let people;
  let errors;

  req.assert('peopleDescription', 'Description cannot be blank').notEmpty();
  req.assert('peopleType', 'Type cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  people = new People({'peopleInsertedBy': req.user.id, 'id': req.body.id});
  people.save({
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
};

/**
 * POST /people/new
 */
exports.peoplePost = function(req, res) {
  let people;
  let errors;

  req.assert('peopleDescription', 'Description cannot be blank').notEmpty();
  req.assert('peopleType', 'Type cannot be blank').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  people = new People();
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
        return res.status(400).send({ msg: 'Error adding User.' });
      });
};
