angular.module('MyApp')
  .controller('TransactionTypeUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', 'DefaultServices', 'TransactionTypeServices', function($scope, $auth, $location, $timeout, DefaultServices, TransactionTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let transactionTypeId = $location.path().substr(18); // to remove /transaction-type/
    let newRecord = true;

    $scope.settings = {};
    $scope.data = [];
    $scope.form = {};
    $scope.typeAction = TransactionTypeServices.getTransactionTypeAction();

    if (Number.isInteger(parseInt(transactionTypeId))) {
      newRecord = false;
      setController(newRecord);
      getTransactionType(transactionTypeId);
    } else {
      newRecord = true;
      setController(newRecord);
    }

    $scope.saveTransactionType = function($valid) {
      if ($scope.settings.transactionType.defaults.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.settings.transactionType.defaults.isSaving = true;

      TransactionTypeServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.settings.transactionType.defaults.isSaving = false;
          $scope.settings.transactionType.defaults.messages = {
            success: [response.data]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/transaction-type/${response.data.transactionType.id}`);
            }, 1000);
            return
          }
        }).catch(function(response) {
          console.warn('Error saving transaction type: ', response);
          $scope.settings.transactionType.defaults.isSaving = false;
          $scope.settings.transactionType.defaults.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    function setController(newRecord) {
      DefaultServices.getSettings()
      .then(function(response) {
        $scope.settings = response;
        setTop(newRecord, response);
        setForm(newRecord, response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err)
      });
    };

    function setTop(newRecord, settings) {
      if (newRecord) {
        DefaultServices.setTop(settings.transactionType.newRecord.top);
        return;
      }
      DefaultServices.setTop(settings.transactionType.existingRecord.top);
    };

    function setForm(newRecord, settings) {
      if (newRecord) {
        $scope.form = settings.transactionType.defaults.form;
        return;
      }
    };

    function getTransactionType(id) {
      TransactionTypeServices.getTransactionTypeById(id)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.transactionType.defaults.isNull = true;
            return;
          }
          $scope.settings.transactionType.defaults.isNull = false;
          $scope.form = response;
        }).catch(function(err) {
          console.warn('Error getting transaction type: ', err);
        });
    };
  }]);
