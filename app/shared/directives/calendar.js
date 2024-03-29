angular.module('MyApp')
  .directive('calendarWidget', ['$location', '$routeParams', '$window', 'CalendarServices', 'TimeServices',
    function($location, $routeParams, $window, CalendarServices, TimeServices) {
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
        $scope.hasTotalWeekDay = false;
        $scope.hasTotalWeek = false;
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
            $scope.hasTotalWeekDay = true;
            $scope.hasTotalWeek = true;
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
              $scope.weekdaysTotal = getWeekDayTotal(_mapTripDataWeekdaysTotal(response));
              buildCalendar(_mapTripData(response));
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
          _buildMonth($scope, start, $scope.month, data, $scope.hasTotalWeek);
          $scope.select = function(day) {
            $scope.selected = day.date;
          };
          // next click
          $scope.next = function() {
            let next = $scope.month.clone();

            _removeTime(next.month(next.month() + 1).date(1));
            $scope.month.month($scope.month.month() + 1);
            _buildMonth($scope, next, $scope.month, data, $scope.hasTotalWeek);
            $scope.displayCurrentMonth = _displayCurrentMonth($scope.month);
            $location.url(`${vm.location.path}?calendar=${$scope.displayCurrentMonth}`);
          };
          // previous click
          $scope.previous = function() {
            let previous = $scope.month.clone();

            _removeTime(previous.month(previous.month()-1).date(1));
            $scope.month.month($scope.month.month()-1);
            _buildMonth($scope, previous, $scope.month, data, $scope.hasTotalWeek);
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

    function _buildMonth($scope, start, month, data, hasTotalWeek) {
      let done = false;
      let date = start.clone();
      let monthIndex = date.month(), count = 0;

      $scope.weeks = [];

      while (!done) {
        $scope.weeks.push({
          days: _buildWeek(date.clone(), month, data, hasTotalWeek)
        });
        date.add(1, "w");
        done = count++ > 2 && monthIndex !== date.month();
        monthIndex = date.month();
      }
    }

    function _buildWeek(date, month, data, hasTotalWeek) {
      let days = [];

      for (var i = 0; i < 7; i++) {
        days.push({
          name: date.format("ddd").substring(0, 3),
          number: date.date(),
          isCurrentMonth: date.month() === month.month(),
          isToday: date.isSame(new Date(), "day"),
          date: date,
          item: getAllItems(date, month, data),
          total: hasTotalWeek ? getAllWeekItems(date, month, data) : 0
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
        dataFormattedObj.item = item.timesheetComments != null ? `${moment(item.timesheetTotalHours, "hh:mm").format("HH:mm")} - Comments` : moment(item.timesheetTotalHours, "hh:mm").format("HH:mm");
        dataFormatted.push(_.clone(dataFormattedObj));
      });
      return dataFormatted;
    }

    // Trip
    function _mapTripData(data) {
      let dataFormatted = [];
      let dataFormattedObj = {
        date: null,
        item: null,
        distance: 0
      };

      _.forEach(data, function(item) {
        dataFormattedObj.date = item.tripDate;
        dataFormattedObj.item = `${item.tripDistance} KM`;
        dataFormattedObj.distance = item.tripDistance;
        dataFormatted.push(_.clone(dataFormattedObj));
      });
      return dataFormatted;
    }

    function _mapTripDataWeekdaysTotal(data) {
      let dataFormatted = [];
      let dataFormattedObj = {};

      _.forEach(data, function(item) {
        dataFormattedObj.date = item.tripDate;
        dataFormattedObj.value = item.tripDistance;
        dataFormatted.push(_.clone(dataFormattedObj));
      });
      return dataFormatted;
    }

    // Data Maintenance
    function _mapDataMaintenanceData(data) {
      let dataFormatted = [];
      let dataFormattedObj = {};

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

    function getAllWeekItems(date, month, data) {
      let total = 0;

      _.result(_.find(data, function(item) {
          if (moment(item.date).format('DD') == date.date() && date.month() === month.month()) {
            total += item.distance;
          }
        }), 'item')

      return total;
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
        tot: 0
      };

      _.forEach(data, function(item) {
        const dayOfTheWeek = moment(item.date).format("ddd").substring(0, 3);
        weekday.tot += item.value;

        switch(dayOfTheWeek){
          case 'Sun':
            weekday.sun += item.value;
            break;
          case 'Mon':
            weekday.mon += item.value;
            break;
          case 'Tue':
            weekday.tue += item.value;
            break;
          case 'Wed':
            weekday.wed += item.value;
            break;
          case 'Thu':
            weekday.thu += item.value;
            break;
          case 'Fri':
            weekday.fri += item.value;
            break;
          case 'Sat':
            weekday.sat += value.item;
            break;
        }

      });
      return weekday;
    }
  }]);
