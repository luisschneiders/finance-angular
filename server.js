const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const request = require('request');
const favicon = require('serve-favicon');
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.cert'),
  requestCert: false,
  rejectUnauthorized: false
};

// Load environment variables from .env file
dotenv.load();

// Models
let User = require('./models/User');
let app = express();
let server = https.createServer(options, app);
// Controllers
let mainController = require('./controllers/main');
let userController = require('./controllers/user');
let contactController = require('./controllers/contact');
let bankController = require('./controllers/bank');
let purchaseController = require('./controllers/purchase');
let expenseTypeController = require('./controllers/expense-type');
let transactionTypeController = require('./controllers/transaction-type');
let peopleController = require('./controllers/people');
let transactionController = require('./controllers/transaction');

app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
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
app.post('/reset/:token', userController.resetPost);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.post('/auth/google', userController.authGoogle);
app.get('/auth/google/callback', userController.authGoogleCallback);

// Profile
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);

// main
app.get('/main-by-year/:year', mainController.mainGetByYear);

// Banks
app.get('/banks', bankController.bankGetAll);
app.get('/banks/:id', bankController.bankGetById);
app.put('/banks/:id', userController.ensureAuthenticated, bankController.bankPut);
app.post('/banks/new', userController.ensureAuthenticated, bankController.bankPost);

// Expense Type
app.get('/all-expenses-type/:isActive', expenseTypeController.expenseTypeGetAll);
app.get('/expenses-type/:id', expenseTypeController.expenseTypeGetById);
app.put('/expenses-type/:id', userController.ensureAuthenticated, expenseTypeController.expenseTypePut);
app.post('/expenses-type/new', userController.ensureAuthenticated, expenseTypeController.expenseTypePost);

// Transaction Type
app.get('/all-transactions-type/:isActive', transactionTypeController.transactionTypeGetAll);
app.get('/transactions-type/:id', transactionTypeController.transactionTypeGetById);
app.put('/transactions-type/:id', userController.ensureAuthenticated, transactionTypeController.transactionTypePut);
app.post('/transactions-type/new', userController.ensureAuthenticated, transactionTypeController.transactionTypePost);

// People
app.get('/people', peopleController.peopleGetAll);
app.get('/people/:id', peopleController.peopleGetById);
app.put('/people/:id', userController.ensureAuthenticated, peopleController.peoplePut);
app.post('/people/new', userController.ensureAuthenticated, peopleController.peoplePost);

// Transaction
app.get('/transactions-by-year-and-month/:year/:month', transactionController.transactionGetByYearAndMonth);
app.get('/transactions-by-custom-search/:from&:to&:transactionType', transactionController.transactionGetByCustomSearch);
// app.put('/transactions-type/:id', userController.ensureAuthenticated, transactionTypeController.transactionTypePut);
// app.post('/transactions-type/new', userController.ensureAuthenticated, transactionTypeController.transactionTypePost);

// Purchase
app.get('/purchases-by-year-and-month/:year/:month', purchaseController.purchaseGetByYearAndMonth);
app.get('/purchases-by-custom-search/:from&:to&:expenseType', purchaseController.purchaseGetByCustomSearch);

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

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = server;
