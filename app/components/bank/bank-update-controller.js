angular.module('MyApp')
  .controller('BankUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'DefaultServices', 'BankServices',
  function($scope, $auth, $location, $timeout, $routeParams, DefaultServices, BankServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let bankId = $routeParams.id;
    let newRecord = null;
    let noRecord = {
      msg: 'No Record Found!'
    };

    $scope.state = {};
    $scope.data = [];
    $scope.form = {};
    $scope.state.noSettings = true;

    if (Number.isInteger(parseInt(bankId))) {
      newRecord = false;
    } else {
      newRecord = true;
    }

    setControllerSettings(newRecord);

    $scope.saveBank = function($valid) {
      if ($scope.state.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.state.isSaving = true;
      BankServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.state.isSaving = false;
          $scope.state.messages = {
            success: [response]
          }
          if(newRecord) {
            $timeout(function() {
              $location.path(`/bank=${response.bank.id}`);
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
          getBank(bankId);
          DefaultServices.setTop(response.bank.existingRecord.top);
        } else {
          $scope.form = response.bank.defaults.form;
          DefaultServices.setTop(response.bank.newRecord.top);
        }
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });
    };

    function getBank(id) {
      BankServices.getBankById(id)
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
