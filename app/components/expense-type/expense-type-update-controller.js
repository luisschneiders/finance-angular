angular.module('MyApp')
  .controller('ExpenseTypeUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', 'DefaultServices', 'ExpenseTypeServices', function($scope, $auth, $location, $timeout, DefaultServices, ExpenseTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let expenseTypeId = $location.path().substr(14); // to remove /expense-type/
    let newRecord = true;

    $scope.settings = {};
    $scope.data = [];
    $scope.form = {};

    if (Number.isInteger(parseInt(expenseTypeId))) {
      newRecord = false;
      setController(newRecord);
      getExpenseType(expenseTypeId);
    } else {
      newRecord = true;
      setController(newRecord);
    }

    $scope.saveExpenseType = function($valid) {
      if ($scope.settings.expenseType.defaults.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.settings.expenseType.defaults.isSaving = true;

      ExpenseTypeServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.settings.expenseType.defaults.isSaving = false;
          $scope.settings.expenseType.defaults.messages = {
            success: [response.data]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/expense-type/${response.data.expenseType.id}`);
            }, 1000);
            return
          }
        }).catch(function(response) {
          console.warn('Error saving expense type: ', response);
          $scope.settings.expenseType.defaults.isSaving = false;
          $scope.settings.expenseType.defaults.messages = {
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
        DefaultServices.setTop(settings.expenseType.newRecord.top);
        return;
      }
      DefaultServices.setTop(settings.expenseType.existingRecord.top);
    };

    function setForm(newRecord, settings) {
      if (newRecord) {
        $scope.form = settings.expenseType.defaults.form;
        return;
      }
    };

    function getExpenseType(id) {
      ExpenseTypeServices.getExpenseTypeById(id)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.expenseType.defaults.isNull = true;
            return;
          }
          $scope.settings.expenseType.defaults.isNull = false;
          $scope.form = response;
        }).catch(function(err) {
          console.warn('Error getting expense type: ', err);
        });
    };
  }]);
