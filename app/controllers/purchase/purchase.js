angular.module('MyApp')
  .controller('PurchaseCtrl', ['$scope', '$auth', '$location', 'moment', 'PurchaseServices', 'DefaultServices',
  function($scope, $auth, $location, moment, PurchaseServices, DefaultServices) {
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
      template: {
        url: 'partials/modal/purchase.tpl.html'
      },
      purchasesByGroup: {},
      typeAction: [],
      isNull: false,
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
      isLoading: true,
      monthAndYear: null,
      currentPeriod: $location.path().substr(10), // to remove /purchase/
      period: {
        month: null,
        year: null
      }
    };

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
      data.modal.title = title.expenseTypeDescription;
      data.modal.purchases = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
          return item;
        }
      });
    }

    $scope.data = data;
  }]);
