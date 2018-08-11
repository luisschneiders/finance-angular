angular.module('MyApp')
  .directive('calendarWidget', ['$location', '$routeParams', '$window', 'CalendarServices', function($location, $routeParams, $window, CalendarServices) {
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
        $scope.selected = moment($routeParams.calendar);
        $scope.month = $scope.selected.clone();
        $scope.displayCurrentMonth = _displayCurrentMonth($scope.month);
        $scope.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        switch($location.path()) {
          case '/timesheets':
            timesheetView();
            break;
          default:
            $scope.errorMessage = 'Error loading calendar for this location!';
            $scope.isValidLocation = false;
            break;
        }

        function timesheetView() {
          vm.location.path = $location.path();
          CalendarServices.getTimesheets($routeParams.calendar)
            .then(function(response) {
              $scope.timesheets = response;
              console.log('LFS - timesheets: ', response);
              buildCalendar(_mapTimesheetData(response));
            }).catch(function(error) {
              console.log('Error getting timesheets:', error);
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
            return _displayCurrentMonth($scope.month);
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
          name: date.format("dd").substring(0, 1),
          number: date.date(),
          isCurrentMonth: date.month() === month.month(),
          isToday: date.isSame(new Date(), "day"),
          date: date,
          item: _.result(_.find(data, function(item) {
            if (moment(item.date).format('DD') == date.date() && date.month() === month.month()) {
              return item;
            }
          }), 'item')
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
        dataFormattedObj.item = moment(item.timesheetTotalhours, "HH:mm").format("hh:mm");
        dataFormatted.push(_.clone(dataFormattedObj))
      });
      return dataFormatted;
    }
  }]);
