angular.module('MyApp')
  .controller('PurchaseCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'ExpenseTypeServices', 'PurchaseServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, ExpenseTypeServices, PurchaseServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        transactions: null,
      },
      purchases: [],
      expensesType: [],
      template: {
        url: null,
        class: null
      },
      purchasesByGroup: {},
      typeAction: [],
      isNull: false,
      isLoading: true,
      isActive: 0,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'Purchases',
        url: 'purchase-new',
        show: true
      },
      monthAndYear: null,
      currentPeriod: $location.path().substr(11), // to remove /purchases/
      period: {
        month: null,
        year: null
      },
      customSearch: {}
    };
    let expensesType = ExpenseTypeServices.getAllExpensesType(data.isActive);
    data.customSearch.active = 1;

    expensesType.then(function(response) {
      data.expensesType = response;
    }).catch(function(err) {
      console.warn('Error getting expenses type: ', err);
    });

    DefaultServices.setTop(data.top);

    getCurrentPeriodPurchases();

    $scope.changePeriod = function(value) {
      data.monthAndYear = DefaultServices.getMonthAndYear();

      if (value == 'd') {
        data.monthAndYear = moment(data.monthAndYear).subtract(1, 'months').format();
      } else {
        data.monthAndYear = moment(data.monthAndYear).add(1, 'months').format();
      }

      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');
      $location.path(`/purchases/${data.period.year}/${data.period.month}`);
    };

    function getCurrentPeriodPurchases() {
      let purchases = null;
      DefaultServices.setMonthAndYear(data.currentPeriod);

      data.monthAndYear = DefaultServices.getMonthAndYear();
      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');

      purchases = PurchaseServices.getPurchasesByYearAndMonth(data.period);
      purchases.then(function(response) {
        data.isNull = false;

        if (Object.keys(response.groupedBy).length === 0) {
          data.isNull = true;
        }

        data.purchases = response.data;
        console.table(data.purchases);
        data.purchasesByGroup = response.groupedBy;
        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    };

    $scope.deletePurchase = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/purchase.tpl.html';
      data.template.class = 'modal-dialog modal-lg';
      data.modal.title = title.expenseTypeDescription;
      data.modal.purchases = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function() {
      data.template.url = 'partials/modal/custom-search-purchase.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.checked) {
        data.customSearch.expenseType = 'all'
      }
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/custom-search-purchases/${data.customSearch.from}/${data.customSearch.to}/${data.customSearch.expenseType.toString()}`);
      }, 500);
    };

    $scope.data = data;
  }]);
