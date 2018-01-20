angular.module('MyApp')
  .controller('ExpenseTypeUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'DefaultServices', 'ExpenseTypeServices',
  function($scope, $auth, $location, $timeout, $routeParams, DefaultServices, ExpenseTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let expenseTypeId = $routeParams.id;
    let newRecord = null;
    let noRecord = {
      msg: 'No Record Found!'
    };

    $scope.state = {};
    $scope.data = [];
    $scope.form = {};
    $scope.state.noSettings = true;

    if (Number.isInteger(parseInt(expenseTypeId))) {
      newRecord = false;
    } else {
      newRecord = true;
    }

    setControllerSettings(newRecord);

    $scope.saveExpenseType = function($valid) {
      if ($scope.state.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.state.isSaving = true;
      ExpenseTypeServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.state.isSaving = false;
          $scope.state.messages = {
            success: [response]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/expense-type=${response.expenseType.id}`);
            }, 1000);
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
          getExpenseType(expenseTypeId);
          DefaultServices.setTop(response.expenseType.existingRecord.top);
        } else {
          $scope.form = response.expenseType.defaults.form;
          DefaultServices.setTop(response.expenseType.newRecord.top);
        }
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });
    };

    function getExpenseType(id) {
      ExpenseTypeServices.getExpenseTypeById(id)
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
          $scope.state.isNull = true;
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
  }]);
