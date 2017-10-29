angular.module('MyApp')
  .controller('MainCtrl', function($scope, $auth, $location, MainServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      isNull: false,
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
    let transactionsData = [];
    let transactionsLabel = [];
    let transactionChart = document.getElementById("transactionChart");
    // let myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 }
    //             }]
    //         }
    //     }
    // });

    DefaultServices.setTop(data.top);    

    getGraphicData();
    
    $scope.changePeriod = function(value) {
      data.year = parseInt(data.year);
      if(value == 'd') {
        data.year = data.year - 1;
        $location.path(`/main/${data.year}`);
        getGraphicData();
      } else {
        data.year = data.year + 1;
        $location.path(`/main/${data.year}`);
        getGraphicData();
      }
    };

    function getGraphicData() {
      let transactions = MainServices.getTransactionsByYear(data.year);
      transactions.then(function(response) {
        data.isNull = false;
        if(response.data.length == 0) {
          data.isNull = true;
        }
        transactionsData = response.data.map(function(value) {
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

        transactionsLabel = response.data.map(function(value){
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

        pieChartColoursBackground = response.data.map(function(value){
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
      }).catch(function(err) {
        console.warn('Error getting banks: ', err);
      });  
    }

    $scope.data = data;        
  });
