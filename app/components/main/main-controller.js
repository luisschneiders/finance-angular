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
      constructor(transactionIsNull, purchaseIsNull, isLoading, noSettings) {
        this.transactionIsNull = transactionIsNull;
        this.purchaseIsNull = purchaseIsNull;
        this.isLoading = isLoading;
        this.noSettings = noSettings;
      }
    };
    class Data {
      constructor(purchases, transactions, daily) {
        this.purchases = purchases;
        this.transactions = transactions;
        this.daily = daily;
      }
    };

    let settings = new Settings();
    let params = new Params($routeParams);
    let status = new Status(false, false, true, true);
    let state = new State(null, params, status, null);
    let data = new Data();
    let pieChart = null;
    let barChart = null;
    let horizontalBar = null;
    let pieChartColoursBackground = [];
    let barChartColoursBackground = [];
    let transactionsLabel = [];
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
            renderDailyGraphic(response[0]);
          }
          if(response[1].length == 0) {//purchase
            status.purchaseIsNull = true;
          } else {
            renderPurchaseGraphic(response[1]);
          }
          status.isLoading = false;
        }).catch(function(error) {
          status.noSettings = true;
          status.isLoading = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    }

    function renderTransactionGraphic(response) {
      let isLeap = moment([params.year]).isLeapYear();
      let days = isLeap == true ? 366 : 365;
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

      data.daily = response.map(function(value) {
        return [Number(value.TotalAmountByLabel / days).toFixed(2)];
      });

      transactionsLabel = response.map(function(value) {
        switch(value.transactionLabel) {
          case 'C':
            value.transactionLabel = settings.defaults.graphic.labels[0];
            break;
          case 'D':
            value.transactionLabel = settings.defaults.graphic.labels[1];
            break;
          case 'T':
            value.transactionLabel = settings.defaults.graphic.labels[2];
            break;
          default:
            value.transactionLabel = 'Label';
        }
        return [value.transactionLabel];
      });

      pieChartColoursBackground = response.map(function(value){
        switch(value.transactionLabel) {
          case settings.defaults.graphic.labels[0]:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.blue;
            break;
          case settings.defaults.graphic.labels[1]:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.orange;
            break;
          case settings.defaults.graphic.labels[2]:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.green;
            break;
          default:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.default;

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
            borderColor: settings.defaults.graphic.colors.border,
            hoverBackgroundColor: settings.defaults.graphic.colors.background,
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
            value.barChartLabelsMonths = settings.defaults.graphic.months[0];
            break;
          case '2':
            value.barChartLabelsMonths = settings.defaults.graphic.months[1];
            break;
          case '3':
            value.barChartLabelsMonths = settings.defaults.graphic.months[2];
            break;
          case '4':
            value.barChartLabelsMonths = settings.defaults.graphic.months[3];
            break;
          case '5':
            value.barChartLabelsMonths = settings.defaults.graphic.months[4];
            break;
          case '6':
            value.barChartLabelsMonths = settings.defaults.graphic.months[5];
            break;
          case '7':
            value.barChartLabelsMonths = settings.defaults.graphic.months[6];
            break;
          case '8':
            value.barChartLabelsMonths = settings.defaults.graphic.months[7];
            break;
          case '9':
            value.barChartLabelsMonths = settings.defaults.graphic.months[8];
            break;
          case '10':
            value.barChartLabelsMonths = settings.defaults.graphic.months[9];
            break;
          case '11':
            value.barChartLabelsMonths = settings.defaults.graphic.months[10];
            break;
          case '12':
            value.barChartLabelsMonths = settings.defaults.graphic.months[11];
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
            value.barChartColoursBackground = settings.defaults.graphic.colors.purple;
            break;
          case '2':
            value.barChartColoursBackground = settings.defaults.graphic.colors.yellow;
            break;
          case '3':
            value.barChartColoursBackground = settings.defaults.graphic.colors.pink;
            break;
          case '4':
            value.barChartColoursBackground = settings.defaults.graphic.colors.blue;
            break;
          case '5':
            value.barChartColoursBackground = settings.defaults.graphic.colors.green;
            break;
          case '6':
            value.barChartColoursBackground = settings.defaults.graphic.colors.orange;
            break;
          case '7':
            value.barChartColoursBackground = settings.defaults.graphic.colors.purple;
            break;
          case '8':
            value.barChartColoursBackground = settings.defaults.graphic.colors.yellow;
            break;
          case '9':
            value.barChartColoursBackground = settings.defaults.graphic.colors.pink;
            break;
          case '10':
            value.barChartColoursBackground = settings.defaults.graphic.colors.blue;
            break;
          case '11':
            value.barChartColoursBackground = settings.defaults.graphic.colors.green;;
            break;
          case '12':
            value.barChartColoursBackground = settings.defaults.graphic.colors.orange;
            break;
          default:
            value.barChartColoursBackground = settings.defaults.graphic.colors.default;
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
                borderColor: settings.defaults.graphic.colors.border,
                hoverBackgroundColor: settings.defaults.graphic.colors.background,
                borderWidth: 1
            }]
        },
        options: barChartOptions
      });
    };

    function renderDailyGraphic(response) {
      let dailyChart = document.getElementById("dailyChart");
      let horizontalBarChartOptions = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };

      horizontalBar = new Chart(dailyChart, {
        type: 'horizontalBar',
        data: {
            labels: transactionsLabel,
            datasets: [{
                label: 'Amount per Day',
                data: data.daily,
                backgroundColor: pieChartColoursBackground,
                borderColor: settings.defaults.graphic.colors.border,
                hoverBackgroundColor: settings.defaults.graphic.colors.background,
                borderWidth: 1
            }]
        },
        options: horizontalBarChartOptions
      });
    }

    $scope.state = state;
  }]);
