angular.module('MyApp')
  .controller('MainCtrl', ['$scope', '$auth', '$location', 'moment', 'MainServices', 'DefaultServices', function($scope, $auth, $location, moment, MainServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionIsNull: false,
      purchaseIsNull: false,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },      
      top: {
        title: 'Annual Graphics',
        url: null,
        show: false
      },
      isLoading: true,
      year: $location.path().substr(6) // to remove /main/
    };
    let pieChart;
    let pieChartColoursBackground = [];
    let barChart;
    let barChartColoursBackground = [];
    let barChartLabelsMonths = [];
    let transactionsData = [];
    let purchaseData = [];
    let transactionsLabel = [];
    let transactionChart = document.getElementById("transactionChart");
    let purchaseChart = document.getElementById("purchaseChart");

    DefaultServices.setTop(data.top);

    getGraphicData();
    
    $scope.changePeriod = function(value) {
      data.year = parseInt(data.year);
      if(value == 'd') {
        data.year = data.year - 1;
        $location.path(`/main/${data.year}`);
      } else {
        data.year = data.year + 1;
        $location.path(`/main/${data.year}`);
      }
    };

    function getGraphicData() {
      let transactions = MainServices.getTransactionsByYear(data.year);
      transactions.then(function(response) {
        data.transactionIsNull = false;
        data.purchaseIsNull = false;

        if(response.data[0].length == 0) {//transaction
          data.transactionIsNull = true;
        } else {
          renderTransactionGraphic(response.data[0]);
        }

        if(response.data[1].length == 0) {//purchase
          data.purchaseIsNull = true;
        } else {
          renderPurchaseGraphic(response.data[1]);
        }

        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    }

    function renderTransactionGraphic(response) {
      transactionsData = response.map(function(value) {
        switch(value.transactionLabel){
          case 'C':
            value.TotalAmountByLabel;
            break;
          case 'D':
            value.TotalAmountByLabel;
            break;
          case 'T':
            value.TotalAmountByLabel = value.TotalAmountByLabel / 2;
            break;
        }
        return [value.TotalAmountByLabel];
      });

      transactionsLabel = response.map(function(value){
        switch(value.transactionLabel){
          case 'C':
            value.transactionLabel = 'INCOMES'
            break;
          case 'D':
            value.transactionLabel = 'OUTCOMES'
            break;
          case 'T':
            value.transactionLabel = 'TRANSFERS'
            break;
        }
        return [value.transactionLabel];
      });

      pieChartColoursBackground = response.map(function(value){
        switch(value.transactionLabel){
          case 'INCOMES':
            value.pieChartColoursBackground = 'rgba(54, 162, 235, 0.2)';
            break;
          case 'OUTCOMES':
            value.pieChartColoursBackground = 'rgba(255, 99, 132, 0.2)';
            break;
          case 'TRANSFERS':
            value.pieChartColoursBackground = 'rgba(75, 192, 192, 0.2)';
            break;
        }
        return [value.pieChartColoursBackground];
      });

      pieChart = new Chart(transactionChart, {
        type: 'pie',
        data: {
          labels: transactionsLabel,
          datasets: [{
            data: transactionsData,
            backgroundColor: pieChartColoursBackground,
            borderColor: '#383838',
            hoverBackgroundColor: 'rgba(77, 77, 51,0.2)',
            borderWidth: 1
          }]
        }
      });
      data.isLoading = false;
    }

    function renderPurchaseGraphic(response) {
      let barChartOptions = {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
      };

      barChartLabelsMonths = response.map(function(value){
        let date = moment(value.purchaseDate);
        let month = date.format('M');
        month = month.toString();
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
        }
        return [value.barChartLabelsMonths];
      });

      barChartColoursBackground = response.map(function(value){
        let date = moment(value.purchaseDate);
        let month = date.format('M');
        month = month.toString();
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
        }
        return [value.barChartColoursBackground];
      });

      purchaseData = response.map(function(value) {
        return [value.TotalAmountByMonth];
      });

      barChart = new Chart(purchaseChart, {
        type: 'bar',
        data: {
            labels: barChartLabelsMonths,
            datasets: [{
                label: 'Month',
                data: purchaseData,
                backgroundColor: barChartColoursBackground,
                borderColor: '#383838',
                hoverBackgroundColor: 'rgba(77, 77, 51,0.2)',
                borderWidth: 1
            }]
        },
        options: barChartOptions
    });
    }

    $scope.data = data;
  }]);
