angular.module('MyApp')
  .controller('PurchaseCustomCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'ExpenseTypeServices', 'PurchaseServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, ExpenseTypeServices, PurchaseServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        purchases: null,
      },
      purchases: [],
      expensesType: [],
      template: {
        url: null
      },
      purchasesByGroup: {},
      isNull: false,
      isActive: 0,
      isLoading: true,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'purchase custom search',
        url: 'purchase-new',
        show: true
      },
      customSearch: {}
    };
    let customSearch = $location.path().substr(25); // to remove /custom-search-purchases/
    let expensesType = ExpenseTypeServices.getAllExpensesType(data.isActive);
    let customPurchase = null;
    let refineSearch = customSearch.split('/');
    let search = {
      from: refineSearch[0],
      to: refineSearch[1],
      expenseType: refineSearch[2]
    };
    
    data.customSearch.active = 1;
    DefaultServices.setTop(data.top);
//  check if date are valid
    if (!moment(refineSearch[0]).isValid() || !moment(refineSearch[1]).isValid()) {
      data.isLoading = false;
      data.isNull = true;
      data.notFound.message = 'Dates are not valid';
      $scope.data = data;
      return;
    }

    customPurchase = PurchaseServices.getPurchasesByCustomSearch(search);

    expensesType.then(function(response) {
      data.expensesType = response;
    }).catch(function(err) {
      console.warn('Error getting expenses type: ', err);
    });

    customPurchase.then(function(response){
      data.isNull = false;

      if (Object.keys(response.groupedBy).length === 0) {
        data.isNull = true;
      }

      data.purchases = response.data;
      data.purchasesByGroup = response.groupedBy;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting purchases: ', err);
    });

    $scope.deletePurchase = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/purchase.tpl.html';
      data.modal.title = title.expenseTypeDescription;
      data.modal.purchases = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function(key) {
      data.template.url = 'partials/modal/custom-search-purchase.tpl.html';
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
