angular.module('MyApp')
  .directive('calendarWidget', ['$location', '$routeParams', '$window', 'CalendarServices',
    function($location, $routeParams, $window, CalendarServices) {
    return {
      restrict: 'EAC',
      templateUrl: 'components/calendar/calendar-view.html',
      $scope: {
        selected: '='
      },
      link: function ($scope) {
        let vm = this;

        vm.isValidDate = moment($routeParams.calendar, 'YYYY-MM', true).isValid();
        vm.location = {
          path: null,
          params: null
        }

        if (!vm.isValidDate) {
          $scope.errorMessage = 'Date is not valid!'
          $scope.isValidDate = false;
          return;
        }

        $scope.isValidDate = true;
        $scope.isValidLocation = true;
        $scope.weekdaysTotal = {};
        $scope.selected = moment($routeParams.calendar);
        $scope.month = $scope.selected.clone();
        $scope.displayCurrentMonth = _displayCurrentMonth($scope.month);
        $scope.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        switch($location.path()) {
          case '/timesheets':
            timesheetView();
            break;
          case '/trips':
            $scope.hasTotal = true;
            tripView();
            break;
          case '/data-maintenance':
            dataMaintenanceView();
            break;
          default:
            $scope.errorMessage = 'Error loading calendar for this feature!';
            $scope.isValidLocation = false;
            break;
        }

        $scope.timesheetView = function() {
          timesheetView();
        }

        function timesheetView() {
          vm.location.path = $location.path();
          CalendarServices.getTimesheets($routeParams.calendar)
            .then(function(response) {
              $scope.timesheets = response;
              buildCalendar(_mapTimesheetData(response));
            }).catch(function(error) {
              console.log('Error getting timesheets: ', error);
            });
        }

        $scope.tripView = function() {
          tripView();
        }

        function tripView() {
          vm.location.path = $location.path();
          CalendarServices.getTrips($routeParams.calendar)
            .then(function(response) {
              $scope.trips = response;
              buildCalendar(_mapTripData(response));
              $scope.weekdaysTotal = getWeekDayTotal(response);
            }).catch(function(error) {
              console.log('Error getting trips: ', error);
            })
        }

        $scope.dataMaintenanceView = function() {
          dataMaintenanceView();
        }

        function dataMaintenanceView() {
          vm.location.path = $location.path();
          CalendarServices.getTransactions($routeParams.calendar)
            .then(function(response) {
              $scope.transactions = response;
              buildCalendar(_mapDataMaintenanceData(response));
            }).catch(function(error) {
              console.log('Error getting transactions: ', error);
            });
        }

        function buildCalendar(data) {
          let start = $scope.selected.clone();

          start.date(1);
          _removeTime(start.day(0));
          _buildMonth($scope, start, $scope.month, data);
          $scope.select = function(day) {
            $scope.selected = day.date;
          };
          // next click
          $scope.next = function() {
            let next = $scope.month.clone();

            _removeTime(next.month(next.month() + 1).date(1));
            $scope.month.month($scope.month.month() + 1);
            _buildMonth($scope, next, $scope.month, data);
            $scope.displayCurrentMonth = _displayCurrentMonth($scope.month);
            $location.url(`${vm.location.path}?calendar=${$scope.displayCurrentMonth}`);
          };
          // previous click
          $scope.previous = function() {
            let previous = $scope.month.clone();

            _removeTime(previous.month(previous.month()-1).date(1));
            $scope.month.month($scope.month.month()-1);
            _buildMonth($scope, previous, $scope.month, data);
            $scope.displayCurrentMonth = _displayCurrentMonth($scope.month);
            $location.url(`${vm.location.path}?calendar=${$scope.displayCurrentMonth}`);
          };
          //current month click
          $scope.currentMonth = function() {
            $location.url(`${vm.location.path}?calendar=${moment().startOf('month').format('YYYY-MM')}`);
          };
        }
      }
    };

    function _displayCurrentMonth(month) {
      return month.format('YYYY-MM');
    }

    function _removeTime(date) {
      return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth($scope, start, month, data) {
      let done = false;
      let date = start.clone();
      let monthIndex = date.month(), count = 0;

      $scope.weeks = [];

      while (!done) {
        $scope.weeks.push({ days: _buildWeek(date.clone(), month, data) });
        date.add(1, "w");
        done = count++ > 2 && monthIndex !== date.month();
        monthIndex = date.month();
      }
    }

    function _buildWeek(date, month, data) {
      let days = [];

      for (var i = 0; i < 7; i++) {
        days.push({
          name: date.format("ddd").substring(0, 3),
          number: date.date(),
          isCurrentMonth: date.month() === month.month(),
          isToday: date.isSame(new Date(), "day"),
          date: date,
          item: getAllItems(date, month, data)
        });
        date = date.clone();
        date.add(1, "d");
      }
      return days;
    }

    // Timesheet
    function _mapTimesheetData(data) {
      let dataFormatted = [];
      let dataFormattedObj = {};

      _.forEach(data, function(item) {
        dataFormattedObj.date = item.timesheetStartDate;
        dataFormattedObj.item = moment(item.timesheetTotalHours, "hh:mm").format("HH:mm");
        dataFormatted.push(_.clone(dataFormattedObj));
      });
      return dataFormatted;
    }

    // Trip
    function _mapTripData(data) {
      let dataFormatted = [];
      let dataFormattedObj = {};

      _.forEach(data, function(item) {
        dataFormattedObj.date = item.tripDate;
        dataFormattedObj.item = `${item.tripDistance} KM`;
        dataFormatted.push(_.clone(dataFormattedObj));
      });
      return dataFormatted;
    }

    // Data Maintenance
    function _mapDataMaintenanceData(data) {
      let dataFormatted = [];
      let dataFormattedObj = {};
      let length = 14;
      _.forEach(data, function(item) {
        dataFormattedObj.date = item.transactionDate;
        dataFormattedObj.item = `${item.transactionLabel} - $ ${item.transactionAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
        dataFormatted.push(_.clone(dataFormattedObj));
      });
      return dataFormatted;
    }

    function getAllItems(date, month, data) {

      let items = [];

      _.result(_.find(data, function(item) {
          if (moment(item.date).format('DD') == date.date() && date.month() === month.month()) {
            items.push(item);
          }
        }), 'item')

      return items;
    }

    function getWeekDayTotal(data) {
      let weekday = {
        sun: 0,
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
        sat: 0,
      }

      _.forEach(data, function(item) {
        const dayOfTheWeek = moment(item.tripDate).format("ddd").substring(0, 3);
        switch(dayOfTheWeek){
          case 'Sun':
            weekday.sun += item.tripDistance;
            break;
          case 'Mon':
            weekday.mon += item.tripDistance;
            break;
          case 'Tue':
            weekday.tue += item.tripDistance;
            break;
          case 'Wed':
            weekday.wed += item.tripDistance;
            break;
          case 'Thu':
            weekday.thu += item.tripDistance;
            break;
          case 'Fri':
            weekday.fri += item.tripDistance;
            break;
          case 'Sat':
            weekday.sat += item.tripDistance;
            break;
        }
      });
      return weekday;
    }
  }]);
