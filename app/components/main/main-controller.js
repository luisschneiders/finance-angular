angular.module('MyApp')
  .controller('MainCtrl', ['$scope', '$auth', '$location', '$routeParams', 'moment', 'DefaultServices', 'MainServices',
  function($scope, $auth, $location, $routeParams, moment, DefaultServices, MainServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    class State {
      constructor(settings, params, status, messages) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
      }
    };
    class Params {
      constructor($routeParams) {
        this.year = $routeParams.year;
      }
    };
    class Settings {
      constructor(defaults, component, templateTop) {
        this.defaults = defaults;
        this.component = component;
        this.templateTop = templateTop;
      }
    };
    class Status {
      constructor() {
        this.transactionIsNull = false;
        this.purchaseIsNull = false;
        this.isLoading = true;
        this.noSettings = true;
        this.errorVIew = false;
      }
    };
    class Data {
      constructor(purchases, transactions) {
        this.purchases = purchases;
        this.transactions = transactions;
      }
    };

    let settings = new Settings();
    let params = new Params($routeParams);
    let status = new Status();
    let state = new State(null, params, status, null);
    let data = new Data();
    let pieChart = null;
    let barChart = null;
    let messages = [];
    let pieChartColoursBackground = [];
    let transactionsLabel = [];
    let barChartColoursBackground = [];
    let barChartLabelsMonths = [];

    DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        settings.defaults = response.defaults;
        settings.component = response.main;
        settings.templateTop = response.main.defaults.template.top;
        state.settings = settings;
        getGraphicData();
      }).catch(function(error) {
        status.noSettings = true;
        status.errorView = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.changePeriod = function(value) {
      params.year = parseInt(params.year);
      if(value == 'd') {
        params.year = params.year - 1;
      } else {
        params.year = params.year + 1;
      }
      $location.path(`/main=${params.year}`);
    };

    function getGraphicData() {
      MainServices.getTransactionsByYear(params.year)
        .then(function(response) {
          status.transactionIsNull = false;
          status.purchaseIsNull = false;

          if(response[0].length == 0) {//transaction
            status.transactionIsNull = true;
          } else {
            renderTransactionGraphic(response[0]);
          }
          if(response[1].length == 0) {//purchase
            status.purchaseIsNull = true;
          } else {
            renderPurchaseGraphic(response[1]);
          }
          status.isLoading = false;
        }).catch(function(error) {
          status.noSettings = true;
          status.errorView = true;
          status.isLoading = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    }

    function renderTransactionGraphic(response) {
      let transactionChart = document.getElementById("transactionChart");
      data.transactions = response.map(function(value) {
        switch(value.transactionLabel) {
          case 'C':
            value.TotalAmountByLabel;
            break;
          case 'D':
            value.TotalAmountByLabel;
            break;
          case 'T':
            value.TotalAmountByLabel = value.TotalAmountByLabel / 2;
            break;
          default:
            value.TotalAmountByLabel;
        }
        return [value.TotalAmountByLabel];
      });

      transactionsLabel = response.map(function(value) {
        switch(value.transactionLabel) {
          case 'C':
            value.transactionLabel = 'Incomes';
            break;
          case 'D':
            value.transactionLabel = 'Outcomes';
            break;
          case 'T':
            value.transactionLabel = 'Transfers';
            break;
          default:
            value.transactionLabel = 'Label';
        }
        return [value.transactionLabel];
      });

      pieChartColoursBackground = response.map(function(value){
        switch(value.transactionLabel) {
          case 'Incomes':
            value.pieChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case 'Outcomes':
            value.pieChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case 'Transfers':
            value.pieChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
          default:
            value.pieChartColoursBackground = 'rgba(75, 192, 192, 0.2)';

        }
        return [value.pieChartColoursBackground];
      });

      pieChart = new Chart(transactionChart, {
        type: 'pie',
        data: {
          labels: transactionsLabel,
          datasets: [{
            data: data.transactions,
            backgroundColor: pieChartColoursBackground,
            borderColor: '#383838',
            hoverBackgroundColor: 'rgba(77, 77, 51,0.2)',
            borderWidth: 1
          }]
        }
      });
    }

    function renderPurchaseGraphic(response) {
      let purchaseChart = document.getElementById("purchaseChart");
      let barChartOptions = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
      };

      barChartLabelsMonths = response.map(function(value) {
        let month = moment(value.purchaseDate).format('M').toString();
        switch(month){
          case '1':
            value.barChartLabelsMonths = 'Jan';
            break;
          case '2':
            value.barChartLabelsMonths = 'Feb';
            break;
          case '3':
            value.barChartLabelsMonths = 'Mar';
            break;
          case '4':
            value.barChartLabelsMonths = 'Apr';
            break;
          case '5':
            value.barChartLabelsMonths = 'May';
            break;
          case '6':
            value.barChartLabelsMonths = 'Jun';
            break;
          case '7':
            value.barChartLabelsMonths = 'Jul';
            break;
          case '8':
            value.barChartLabelsMonths = 'Aug';
            break;
          case '9':
            value.barChartLabelsMonths = 'Sep';
            break;
          case '10':
            value.barChartLabelsMonths = 'Oct';
            break;
          case '11':
            value.barChartLabelsMonths = 'Nov';
            break;
          case '12':
            value.barChartLabelsMonths = 'Dec';
            break;
          default:
            value.barChartLabelsMonths = 'Month';
        }
        return [value.barChartLabelsMonths];
      });

      barChartColoursBackground = response.map(function(value) {
        let month = moment(value.purchaseDate).format('M').toString();
        switch(month){
          case '1':
            value.barChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case '2':
            value.barChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case '3':
            value.barChartColoursBackground = 'rgba(255, 206, 86, 0.2)';
            break;
          case '4':
            value.barChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
          case '5':
            value.barChartColoursBackground = 'rgba(153, 102, 255, 0.2)';
            break;
          case '6':
            value.barChartColoursBackground = 'rgba(255, 159, 64, 0.2)';
            break;
          case '7':
            value.barChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case '8':
            value.barChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case '9':
            value.barChartColoursBackground = 'rgba(255, 206, 86, 0.2)';
            break;
          case '10':
            value.barChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
          case '11':
            value.barChartColoursBackground = 'rgba(153, 102, 255, 0.2)';
            break;
          case '12':
            value.barChartColoursBackground = 'rgba(255, 159, 64, 0.2)';
            break;
          default:
            value.barChartColoursBackground = 'rgba(255, 159, 64, 0.2)';
        }
        return [value.barChartColoursBackground];
      });

      data.purchases = response.map(function(value) {
        return [value.TotalAmountByMonth];
      });
      barChart = new Chart(purchaseChart, {
        type: 'bar',
        data: {
            labels: barChartLabelsMonths,
            datasets: [{
                label: 'Month',
                data: data.purchases,
                backgroundColor: barChartColoursBackground,
                borderColor: '#383838',
                hoverBackgroundColor: 'rgba(77, 77, 51,0.2)',
                borderWidth: 1
            }]
        },
        options: barChartOptions
      });
    };
    $scope.state = state;
  }]);
