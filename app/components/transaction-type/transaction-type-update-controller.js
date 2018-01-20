angular.module('MyApp')
  .controller('TransactionTypeUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'DefaultServices', 'TransactionTypeServices',
  function($scope, $auth, $location, $timeout, $routeParams, DefaultServices, TransactionTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let transactionTypeId = $routeParams.id;
    let newRecord = null;
    let noRecord = {
      msg: 'No Record Found!'
    };

    $scope.state = {};
    $scope.data = [];
    $scope.form = {};
    $scope.state.noSettings = true;
    $scope.typeAction = TransactionTypeServices.getTransactionTypeAction();

    if (Number.isInteger(parseInt(transactionTypeId))) {
      newRecord = false;
    } else {
      newRecord = true;
    }

    setControllerSettings(newRecord);

    $scope.saveTransactionType = function($valid) {
      if ($scope.state.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.state.isSaving = true;

      TransactionTypeServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.state.isSaving = false;
          $scope.state.messages = {
            success: [response]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/transaction-type=${response.transactionType.id}`);
            }, 1000);
            return
          }
        }).catch(function(error) {
          $scope.state.isSaving = false;
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function setControllerSettings(newRecord) {
      DefaultServices.getSettings()
      .then(function(response) {
        $scope.state.noSettings = false;
        if(!newRecord) {
          getTransactionType(transactionTypeId);
          DefaultServices.setTop(response.transactionType.existingRecord.top);
        } else {
          $scope.form = response.transactionType.defaults.form;
          DefaultServices.setTop(response.transactionType.newRecord.top);
        }
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });
    };

    function getTransactionType(id) {
      TransactionTypeServices.getTransactionTypeById(id)
        .then(function(response) {
          if(!response) {
            $scope.state.isNull = true;
            $scope.state.messages = {
              error: Array.isArray(noRecord) ? noRecord : [noRecord]
            };
            return;
          }
          $scope.state.isNull = false;
          $scope.form = response;
        }).catch(function(error) {
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
  }]);
