angular.module('MyApp')
  .controller('ExpenseTypeCtrl', ['$scope', '$auth', '$location', '$routeParams', 'DefaultServices', 'ExpenseTypeServices',
  function($scope, $auth, $location, $routeParams, DefaultServices, ExpenseTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    };
    class State {
      constructor(settings, params, status, messages, pagination, pageSize) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.pagination = pagination;
        this.pageSize = pageSize;
      }
    };
    class Settings {
      constructor(defaults, component, templateTop) {
        this.defaults = defaults;
        this.component = component;
        this.templateTop = templateTop;
      }
    };
    class Params {
      constructor($routeParams) {
        this.page = $routeParams.page;
        this.pageSize = $routeParams.pageSize;
      }
    };
    class Status {
      constructor(isLoading, noSettings) {
        this.isLoading = isLoading;
        this.noSettings = noSettings;
      }
    };
    class Data {
      constructor(expensesType) {
        this.expensesType = expensesType;
      }
    };

    let settings = new Settings();
    let params = new Params($routeParams);
    let status = new Status(true, true);
    let data = new Data();
    let state = new State(settings, params, status, null, null, null);

    DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        settings.defaults = response.defaults;
        settings.component = response.expenseType;
        settings.templateTop = response.expenseType.defaults.template.top;
        state.settings = settings;
        getExpenseType();
      }).catch(function(error) {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.editExpenseType = function(id) {
      $location.path(`/expense-type=${id}`);
    };

    $scope.previousPage = function() {
      $location.path(`/all-expenses-type/page=${state.pagination.page - 1}&pageSize=${state.pagination.pageSize}`);
    };

    $scope.nextPage = function() {
      $location.path(`/all-expenses-type/page=${state.pagination.page + 1}&pageSize=${state.pagination.pageSize}`);
    };

    $scope.refreshList = function(pageSize) {
      $location.path(`/all-expenses-type/page=${state.pagination.page}&pageSize=${pageSize}`);
    };

    function getExpenseType() {
      ExpenseTypeServices.getAllExpensesType(params)
        .then(function(response) {
          status.isLoading = false;
          data.expensesType = response.expensesType;
          state.pagination = response.pagination;
        }).catch(function(error) {
          status.isLoading = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    $scope.state = state;
    $scope.data = data;
  }]);
