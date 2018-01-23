angular.module('MyApp')
  .controller('PurchaseCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'moment', 'DefaultServices', 'ExpenseTypeServices', 'PurchaseServices',
  function($scope, $auth, $location, $timeout, $routeParams, moment, DefaultServices, ExpenseTypeServices, PurchaseServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let params = {
      from: $routeParams.from,
      to: $routeParams.to,
      expenses: $routeParams.id
    }
    let purchasesDetails = [];
    let state = {
      settings: {},
      isNull: false,
      isLoading: true,
      isLoadingModal: true,
      noSettings: true,
      customSearch: {},
      messages: {},
      params: params,
      modal: {},
      template: {},
    };
    let data = {
      purchases: [],
      purchasesByGroup: {},
      purchasesDetails: purchasesDetails,
      expensesType: [],
    };

    DefaultServices.getSettings()
      .then(function(response) {
        getPurchases();
        state.noSettings = false;
        state.settings = response;
        DefaultServices.setTop(response.purchases.defaults.top);
      }).catch(function(error) {
        state.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.changePeriod = function(value) {
      params = {
        from: $routeParams.from,
        to: $routeParams.to,
        expenses: $routeParams.id
      };
      if (value == 'd') {
        params.from = moment(params.from).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        params.to = moment(params.to).subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else {
        params.from = moment(params.from).add(1, 'months').startOf('month').format('YYYY-MM-DD');
        params.to = moment(params.to).add(1, 'months').endOf('month').format('YYYY-MM-DD');
      }
      $location.path(`/purchases/from=${params.from}&to=${params.to}&expenses=all`);
    };

    $scope.seeDetails = function(key, title) {
      state.template.url = 'components/modal/purchase.tpl.html',
      state.template.class = 'modal-dialog modal-lg'
      state.modal.title = title.expenseTypeDescription;
      data.purchasesDetails = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
          return item;
        }
      });
    };

    $scope.customSearch = function() {
      state.isLoadingModal = true;
      state.template.url = 'components/modal/custom-search-purchase.tpl.html';
      state.template.class = 'modal-dialog';
      state.modal.title = 'Custom Search';
      getActiveExpensesType();
    };

    $scope.customSearchForm = function($valid) {
      // TODO: More validation to be added
      if(!$valid) {
        return;
      }
      if(state.customSearch.expenseType == undefined) {
        params.expenses = setExpensesType();
      } else {
        params.expenses = state.customSearch.expenseType;
      }
      params.from = state.customSearch.from;
      params.to = state.customSearch.to;
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/purchases/from=${params.from}&to=${params.to}&expenses=${params.expenses}`);
      }, 500);
    };

    function getPurchases() {
      PurchaseServices.getPurchasesByCustomSearch(params)
        .then(function(response) {
          state.isLoading = false;
          data.purchases = response.data;
          if(response.data.length === 0) {
            state.isNull = true;
          }
          data.purchasesByGroup = response.groupedBy;
        }).catch(function(error){
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
    function getActiveExpensesType() {
      ExpenseTypeServices.getActiveExpensesType()
        .then(function(response) {
          data.expensesType = response;
          state.isLoadingModal = false;
        }).catch(function(error) {
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
    function setExpensesType() {
      let expenses = [];
      _.forEach(data.expensesType, function(expense) {
        expenses.push(expense.id);
      });
      return expenses;
    };

    $scope.state = state;
    $scope.data = data;
  }]);
