angular.module('MyApp')
  .directive('searchPlaces', ['AppStatusServices', function(AppStatusServices) {
    return {
      require: 'ngModel',
      replace: true,
      scope: {
          ngModel: '=',
          latitude: '=',
          longitude: '=',
          ngDisabled: '='
      },
      template: '<input class="form-control" type="text" placeholder="">',
      link: function(scope, element, attrs, model) {
        let options = {
            types: []
        };

        scope.appStatus = AppStatusServices;
        scope.$watch('appStatus.isOnline()', function(online) {
          scope.ngDisabled = online ? false : true;
        });

        if (typeof google === "undefined") {
          scope.appStatus.onLine = false;
          return;
        }

        let autocomplete = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          scope.$apply(function() {
            let geoComponents = autocomplete.getPlace();
            scope.latitude = geoComponents.geometry.location.lat();
            scope.longitude = geoComponents.geometry.location.lng();
            model.$setViewValue(element.val());
          });
        });
      }
    }
  }]);
