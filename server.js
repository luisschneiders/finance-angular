const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const request = require('request');
const favicon = require('serve-favicon');

// Load environment variables from .env file
dotenv.load();

// Models
let User = require('./models/User');
let app = express();

// Controllers
let settingsController = require('./controllers/settings');
let mainController = require('./controllers/main');
let userController = require('./controllers/user');
let contactController = require('./controllers/contact');
let bankController = require('./controllers/bank');
let purchaseController = require('./controllers/purchase');
let expenseTypeController = require('./controllers/expense-type');
let transactionTypeController = require('./controllers/transaction-type');
let peopleController = require('./controllers/people');
let transactionController = require('./controllers/transaction');
let timesheetController = require('./controllers/timesheet');
let tripController = require('./controllers/trip');
let vehicleController = require('./controllers/vehicle');

app.disable('x-powered-by');
app.set('port', process.env.PORT || 4040);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public','/img/favicon.png')));

app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    let token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    let payload = req.isAuthenticated();
    new User({ id: payload.sub })
      .fetch()
      .then(function(user) {
        req.user = user;
        next();
      });
  } else {
    next();
  }
});

app.post('/contact', contactController.contactPost);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset-password=:token', userController.resetPassword);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.post('/auth/google', userController.authGoogle);
app.get('/auth/google/callback', userController.authGoogleCallback);

// Settings
app.get('/settings', settingsController.getSettings);

// Profile
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);

// Main
app.get('/main-by-year/:year', mainController.getTransactionsAndPurchasesByYear);

// Banks
app.get('/get-all-banks/page=:page&pageSize=:pageSize', bankController.getAllBanks);
app.get('/get-active-banks', bankController.getActiveBanks);
app.get('/bank-id=:id', bankController.getBankById);
app.put('/bank-id=:id', userController.ensureAuthenticated, bankController.saveBank);
app.post('/bank-new', userController.ensureAuthenticated, bankController.saveBank);

// Expense Type
app.get('/get-all-expenses-type/page=:page&pageSize=:pageSize', expenseTypeController.getAllExpensesType);
app.get('/get-active-expenses-type', expenseTypeController.getActiveExpensesType);
app.get('/expense-type-id=:id', expenseTypeController.getExpenseTypeById);
app.put('/expense-type-id=:id', userController.ensureAuthenticated, expenseTypeController.saveExpenseType);
app.post('/expense-type-new', userController.ensureAuthenticated, expenseTypeController.saveExpenseType);

// Transaction Type
app.get('/get-all-transactions-type/page=:page&pageSize=:pageSize', transactionTypeController.getAllTransactionsType);
app.get('/get-active-transactions-type', transactionTypeController.getActiveTransactionsType);
app.get('/transaction-type-id=:id', transactionTypeController.getTransactionTypeById);
app.put('/transaction-type-id=:id', userController.ensureAuthenticated, transactionTypeController.saveTransactionType);
app.post('/transaction-type-new', userController.ensureAuthenticated, transactionTypeController.saveTransactionType);

// People
app.get('/get-all-people/page=:page&pageSize=:pageSize', peopleController.getAllPeople);
app.get('/get-active-people', peopleController.getActivePeople);
app.get('/people-id=:id', peopleController.getPeopleById);
app.put('/people-id=:id', userController.ensureAuthenticated, peopleController.savePeople);
app.post('/people-new', userController.ensureAuthenticated, peopleController.savePeople);
app.get('/get-people-by-role=:role', peopleController.getPeopleByRole);

// Transaction
app.get('/get-all-transactions-month/:period', transactionController.getAllTransactions);
app.get('/transactions-by-custom-search/:from&:to&:transactionType', transactionController.getTransactionByCustomSearch);
app.post('/transactions/new', userController.ensureAuthenticated, transactionController.saveTransaction);

// Purchase
app.get('/purchases-by-custom-search/:from&:to&:expenseType', purchaseController.getPurchasesByCustomSearch);
app.post('/purchases/new', userController.ensureAuthenticated, purchaseController.savePurchase);

// Timesheet
app.get('/get-all-timesheets-month/:period', timesheetController.getAllTimesheetsByMonth);
app.post('/timesheets/new', userController.ensureAuthenticated, timesheetController.saveTimesheet);
app.put('/timesheets/update-status=:id', userController.ensureAuthenticated, timesheetController.saveTimesheet);
app.put('/timesheets/remove-timesheet=:id', userController.ensureAuthenticated, timesheetController.removeTimesheet);

// Trip
app.get('/get-all-trips-month/:period', tripController.getAllTripsByMonth);
app.post('/trips/new', userController.ensureAuthenticated, tripController.saveTrip);
app.put('/trips/remove-trip=:id', userController.ensureAuthenticated, tripController.removeTrip);

// Vehicle
app.get('/get-all-vehicles/page=:page&pageSize=:pageSize', vehicleController.getAllVehicles);
app.get('/get-active-vehicles', vehicleController.getActiveVehicles);
app.get('/vehicle-id=:id', vehicleController.getVehicleById);
app.put('/vehicle-id=:id', userController.ensureAuthenticated, vehicleController.saveVehicle);
app.post('/vehicle-new', userController.ensureAuthenticated, vehicleController.saveVehicle);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});
app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
