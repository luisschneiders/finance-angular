angular.module('MyApp')
  .controller('BankUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', 'BankServices', 'DefaultServices', function($scope, $auth, $location, $timeout, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let bankId = $location.path().substr(6); // to remove path /bank/
    let newRecord = true;

    $scope.settings = {};
    $scope.data = [];
    $scope.form = {};

    if (Number.isInteger(parseInt(bankId))) {
      newRecord = false;
      setController(newRecord);
      getBank(bankId);
    } else {
      newRecord = true;
      setController(newRecord);
    }

    $scope.saveBank = function($valid) {
      if ($scope.settings.bank.defaults.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.settings.bank.defaults.isSaving = true;

      BankServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.settings.bank.defaults.isSaving = false;
          $scope.settings.bank.defaults.messages = {
            success: [response.data]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/bank/${response.data.bank.id}`);
            }, 1000);
            return
          }
        }).catch(function(response) {
          console.warn('Error saving bank: ', response);
          $scope.settings.bank.defaults.isSaving = false;
          $scope.settings.bank.defaults.messages = {
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
        DefaultServices.setTop(settings.bank.newRecord.top);
        return;
      }
      DefaultServices.setTop(settings.bank.existingRecord.top);
    };

    function setForm(newRecord, settings) {
      if (newRecord) {
        $scope.form = settings.bank.defaults.form;
        return;
      }
    };

    function getBank(id) {
      BankServices.getBankById(id)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.bank.defaults.isNull = true;
            return;
          }
          $scope.settings.bank.defaults.isNull = false;
          $scope.form = response;
        }).catch(function(err) {
          console.warn('Error getting banks: ', err);
        });
    };

  }]);
