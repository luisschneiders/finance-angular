angular.module('MyApp')
  .controller('MainCtrl', ['$scope', '$auth', '$location', '$routeParams', 'moment', 'DefaultServices', 'MainServices', 'TimeServices',
  function($scope, $auth, $location, $routeParams, moment, DefaultServices, MainServices, TimeServices) {
    $scope.isAuthenticated = () => {
      return $auth.isAuthenticated();
    };
    class State {
      constructor(settings, params, status, messages, data) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.data = data;
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
      constructor(transactionIsNull, purchaseIsNull, isBank, isSpentMost, isLoading, noSettings, isTimesheet) {
        this.transactionIsNull = transactionIsNull;
        this.purchaseIsNull = purchaseIsNull;
        this.isBank = isBank;
        this.isSpentMost = isSpentMost;
        this.isLoading = isLoading;
        this.noSettings = noSettings;
        this.isTimesheet = isTimesheet;
      }
    };
    class Data {
      constructor(transactions, daily, incomeAndOutcome, banks, spentMostExpensiveType, timesheetTotalHours) {
        this.transactions = transactions;
        this.daily = daily;
        this.incomeAndOutcome = incomeAndOutcome;
        this.banks = banks;
        this.spentMostExpensiveType = spentMostExpensiveType;
        this.timesheetTotalHours = timesheetTotalHours;
      }
    };

    let incomeAndOutcome = {
      income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      outcome: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    let spentMostExpensiveType = {};
    let banks = {
      totalCash: 0,
      bankCurrentBalance: {}
    };
    let settings = new Settings();
    let params = new Params($routeParams);
    let status = new Status(false, false, false, false, true, true, false);
    let data = new Data(null, null, incomeAndOutcome, null, spentMostExpensiveType, banks);
    let state = new State(null, params, status, null, data);
    let pieChart = null;
    let barChart = null;
    let horizontalBar = null;
    let doughnutChart = null;
    let pieChartColoursBackground = [];
    let barChartColoursBackground = [];
    let doughnutChartColoursBackground = [];
    let transactionsLabel = [];
    let banksLabel = [];
    let barChartLabelsMonths = [];

    DefaultServices.getSettings()
      .then((response) => {
        status.noSettings = false;
        settings.defaults = response.defaults;
        settings.component = response.main;
        settings.templateTop = response.main.defaults.template.top;
        state.settings = settings;
        getGraphicData();
      }).catch((error) => {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.changePeriod = (value) => {
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
        .then((response) => {
          status.transactionIsNull = false;
          status.purchaseIsNull = false;
          status.isBank = true;
          status.isSpentMost = true;
          status.isTimesheet = true;

          if(response[0].length == 0) {//transaction
            status.transactionIsNull = true;
          } else {
            renderTransactionGraphic(response[0]);
            renderDailyGraphic();
          }
          if(response[1].length == 0 && response[2].length == 0) {//income & purchase
            status.purchaseIsNull = true;
          } else {
            renderPurchaseGraphic(response[1], response[2]);
          }
          if(response[3].length == 0) {//banks
            status.isBank = false;
          } else {
            renderBankGraphic(response[3]);
          }
          if (response[4].length == 0) {// spent the most
            status.isSpentMost = false;
          } else {
            getSpentMost(response[4]);
          }
          if (response[5].length == 0) {// timesheet
            status.isTimesheet = false;
          } else {
            getWorkedHours(response[5]);
          }
          status.isLoading = false;
        }).catch((error) => {
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
      let transactionChart = document.getElementById('transactionChart');

      data.transactions = response.map((value) => {
        switch(value.transactionLabel) {
          case settings.defaults.graphic.labels.income.id:
            value.TotalAmountByLabel;
            break;
          case settings.defaults.graphic.labels.outcome.id:
            value.TotalAmountByLabel;
            break;
          case settings.defaults.graphic.labels.transfers.id:
            value.TotalAmountByLabel = (value.TotalAmountByLabel / 2).toFixed(2);
            break;
          default:
            value.TotalAmountByLabel;
        }
        return [value.TotalAmountByLabel];
      });

      data.daily = response.map((value) => {
        return [Number(value.TotalAmountByLabel / days).toFixed(2)];
      });

      transactionsLabel = response.map((value) => {
        switch(value.transactionLabel) {
          case settings.defaults.graphic.labels.income.id:
            value.label = settings.defaults.graphic.labels.income.label;
            break;
          case settings.defaults.graphic.labels.outcome.id:
            value.label = settings.defaults.graphic.labels.outcome.label;
            break;
          case settings.defaults.graphic.labels.transfers.id:
            value.label = settings.defaults.graphic.labels.transfers.label;
            break;
          default:
            value.label = 'Label';
        }
        return [value.label];
      });

      pieChartColoursBackground = response.map((value) => {
        switch(value.transactionLabel) {
          case settings.defaults.graphic.labels.income.id:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.color6;
            break;
          case settings.defaults.graphic.labels.outcome.id:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.color2;
            break;
          case settings.defaults.graphic.labels.transfers.id:
            value.pieChartColoursBackground = settings.defaults.graphic.colors.color3;
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
        },
        options: {
          legend: {
            position: 'left'
          }
        }
      });
    }

    function renderPurchaseGraphic(outcome, income) {
      let month = 0;
      let purchaseChart = document.getElementById('purchaseChart');
      let barChartOptions = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
        };

      barChartLabelsMonths = [
        settings.defaults.graphic.months[0],
        settings.defaults.graphic.months[1],
        settings.defaults.graphic.months[2],
        settings.defaults.graphic.months[3],
        settings.defaults.graphic.months[4],
        settings.defaults.graphic.months[5],
        settings.defaults.graphic.months[6],
        settings.defaults.graphic.months[7],
        settings.defaults.graphic.months[8],
        settings.defaults.graphic.months[9],
        settings.defaults.graphic.months[10],
        settings.defaults.graphic.months[11],
      ]

      data.incomeAndOutcome.income.forEach(function(item, index){
        if (income[index]) {
          month = parseInt(moment(income[index].transactionDate).format('M'))
          data.incomeAndOutcome.income[month - 1] = income[index].TotalIncomeByMonth;
        }
      });

      data.incomeAndOutcome.outcome.forEach(function(item, index){
        if (outcome[index]) {
          month = parseInt(moment(outcome[index].purchaseDate).format('M'))
          data.incomeAndOutcome.outcome[month - 1] = outcome[index].TotalAmountByMonth;
        }
      });

      barChart = new Chart(purchaseChart, {
        type: 'bar',
        data: {
            labels: barChartLabelsMonths,
            datasets: [{
              label: 'Incomes',
              data: data.incomeAndOutcome.income,
              backgroundColor: settings.defaults.graphic.colors.color6,
              borderColor: settings.defaults.graphic.colors.border,
              hoverBackgroundColor: settings.defaults.graphic.colors.background,
              borderWidth: 1
            },
            {
              label: 'Outcomes',
              data: data.incomeAndOutcome.outcome,
              backgroundColor: settings.defaults.graphic.colors.color2,
              borderColor: settings.defaults.graphic.colors.border,
              hoverBackgroundColor: settings.defaults.graphic.colors.background,
              borderWidth: 1
            }]
        },
        options: barChartOptions
      });
    };

    function renderDailyGraphic() {
      let dailyChart = document.getElementById('dailyChart');
      let horizontalBarChartOptions = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          position: 'left'
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

    function renderBankGraphic(bank) {
      let bankChart = document.getElementById('bankChart');
      let totalCash = 0;
      banks.bankCurrentBalance = bank.map((value, index) => {
        banksLabel.push(value.bankDescription);
        if (value.bankCurrentBalance >= 0 && value.bankCurrentBalance <= 1000) {
          doughnutChartColoursBackground.push(settings.defaults.graphic.colors.color2);
        } else if (value.bankCurrentBalance >= 1000 && value.bankCurrentBalance <= 20000) {
          doughnutChartColoursBackground.push(settings.defaults.graphic.colors.color3);
        } else {
          doughnutChartColoursBackground.push(settings.defaults.graphic.colors.color6);
        }
        totalCash += value.bankCurrentBalance;
        return [value.bankCurrentBalance];
      });

      banks.totalCash = totalCash.toFixed(2);
      data.banks = banks;
      doughnutChart = new Chart(bankChart, {
        type: 'doughnut',
        data: {
          labels: banksLabel,
          datasets: [{
            data: data.banks.bankCurrentBalance,
            backgroundColor: doughnutChartColoursBackground,
            borderColor: settings.defaults.graphic.colors.border,
            hoverBackgroundColor: settings.defaults.graphic.colors.background,
            borderWidth: 1
          }]
        },
        options: {
          legend: {
            position: 'left'
          }
        }
      });
    }

    function getSpentMost(expenses) {
      data.spentMostExpensiveType = expenses.reduce((previous, current) => {
        return (previous.TotalAmountByExpensiveType > current.TotalAmountByExpensiveType) ? previous : current;
      });
    }

    function getWorkedHours(timesheets) {
      data.timesheetTotalHours = TimeServices.getWorkedHours(timesheets);
    }

    $scope.state = state;
  }]);
