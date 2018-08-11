angular.module('MyApp')
  .directive('timepicker', function() {
    return {
      require: 'ngModel',
      link: function (scope, el, attr, ngModel) {
        $(el).timepicker({
          timeFormat: 'H:i',
          onSelect: function (timeText) {
            scope.$apply(function () {
              ngModel.$setViewValue(timeText);
            });
          }
        });
      }
    };
  });
