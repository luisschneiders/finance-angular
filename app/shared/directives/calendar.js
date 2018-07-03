angular.module('MyApp')
  .directive('calendarWidget', ['$location', '$routeParams', function($location, $routeParams) {
    return {
      restrict: 'EAC',
      templateUrl: 'components/calendar/calendar-view.html',
      scope: {
        selected: '='
      },
      link: function (scope) {
        scope.selected = moment($routeParams.calendar);
        scope.month = scope.selected.clone();
        scope.displayCurrentMonth = _displayCurrentMonth(scope.month);
        scope.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let start = scope.selected.clone();

        start.date(1);
        _removeTime(start.day(0));
        _buildMonth(scope, start, scope.month);
        scope.select = function(day) {
          scope.selected = day.date;
        };
        // next click
        scope.next = function() {
          let next = scope.month.clone();

          _removeTime(next.month(next.month() + 1).date(1));
          scope.month.month(scope.month.month() + 1);
          _buildMonth(scope, next, scope.month);
          scope.displayCurrentMonth = _displayCurrentMonth(scope.month);
          $location.url(`${$location.path()}?calendar=${scope.displayCurrentMonth}`);
        };
        // previous click
        scope.previous = function() {
          let previous = scope.month.clone();

          _removeTime(previous.month(previous.month()-1).date(1));
          scope.month.month(scope.month.month()-1);
          _buildMonth(scope, previous, scope.month);
          scope.displayCurrentMonth = _displayCurrentMonth(scope.month);
          $location.url(`${$location.path()}?calendar=${scope.displayCurrentMonth}`);
        };
        //current month click
        scope.currentMonth = function() {
          return _displayCurrentMonth(scope.month);
        };
      }
    };

    function _displayCurrentMonth(month) {
      return month.format('YYYY-MM');
    }

    function _removeTime(date) {
      return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        let done = false, 
            date = start.clone(), 
            monthIndex = date.month(), count = 0;

        while (!done) {
          scope.weeks.push({ days: _buildWeek(date.clone(), month) });
          date.add(1, "w");
          done = count++ > 2 && monthIndex !== date.month();
          monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        let days = [];

        for (var i = 0; i < 7; i++) {
          days.push({
            name: date.format("dd").substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), "day"),
            date: date
          });
          date = date.clone();
          date.add(1, "d");
        }

        return days;
    }
  }]);
