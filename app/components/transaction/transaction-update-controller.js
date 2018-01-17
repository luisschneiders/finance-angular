angular.module('MyApp')
  .controller('TransactionUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', 'DefaultServices', 'TransactionTypeServices', 'BankServices',
  function($scope, $auth, $location, $timeout, DefaultServices, TransactionTypeServices, BankServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    $scope.settings = {};
    $scope.form = {};
    $scope.transactionTypeObj = {};
    $scope.transactionsType = [];
    $scope.banks = [];

    let newRecord = true;
    let isValidForm = false;
    let transactionTypeAction = 'T';

    setControllerSettings(newRecord);

    $scope.saveTransaction = function($valid) {
      if ($scope.settings.transactions.defaults.isSaving) {
        return;
      }
      if (!$valid) {
        $scope.settings.transactions.defaults.messages = {
          error: [{
            msg: $scope.settings.transactions.defaults.required
          }]
        };
        return;
      }
      isValidForm = checkValidation($scope.form);
      console.log('form', $scope.form);
      console.log('isValidForm', isValidForm);
      // $scope.settings.transactions.defaults.isSaving = true;
    };

    $scope.checkTransactionTypeAction = function (model, option) {
      let bankFromDescription = '';
      let bankToDescription = '';
      if (model.transactionTypeAction == transactionTypeAction) {
        _.find($scope.banks, function(bank){
          if ($scope.form.transactionFromBank == bank.id) {
            bankFromDescription = bank.bankDescription;
          }
          if ($scope.form.transactionToBank == bank.id) {
            bankToDescription = bank.bankDescription;
          }
        });
        return $scope.form.transactionComments = `FROM: ${bankFromDescription.toUpperCase()}, TO: ${bankToDescription.toUpperCase()}`
      }
      return $scope.form.transactionComments = '';
    };

    function setControllerSettings(newRecord) {
      DefaultServices.getSettings()
      .then(function(response) {
        $scope.settings = response;
        setTop(newRecord, response);
        setForm(newRecord, response);
        getTransactionsType(response);
        getBanks(response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err)
      });
    };

    function setTop(newRecord, settings) {
      DefaultServices.setTop(settings.transactions.newRecord.top);
    };

    function setForm(newRecord, settings) {
      $scope.form = settings.transactions.defaults.form;
    };

    function getTransactionsType(settings) {
      TransactionTypeServices.getAllTransactionsType(settings.transactions.defaults.isActive)
        .then(function(response){
          $scope.transactionsType = response;
        }).catch(function(response) {
          console.warn('Error getting transaction type: ', response);
          data.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }

    function getBanks(settings) {
      BankServices.getAllBanks(settings.transactions.defaults.isActive)
        .then(function(response) {
          $scope.banks = response;
        }).catch(function(response) {
          console.warn.apply('Error getting banks: ', response);
          data.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          }
        });
    };

    function checkValidation() {
      if (parseFloat($scope.form.transactionAmount) === 0) {
        $scope.settings.transactions.defaults.messages = {
          error: [{
            msg: $scope.settings.transactions.defaults.notZero
          }]
        };
        return false;
      }
      
      return true;
    };
  }]);
