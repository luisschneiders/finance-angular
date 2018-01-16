angular.module('MyApp')
  .directive('calendar', function() {
    return {
      require: 'ngModel',
      link: function (scope, el, attr, ngModel) {
        $(el).datepicker({
          dateFormat: 'yy-mm-dd',
          changeMonth: true,
          changeYear: true,
          onSelect: function (dateText) {
            scope.$apply(function () {
              ngModel.$setViewValue(dateText);
            });
          }
        });
      }
    };
  });
