angular.module('MyApp')
  .directive('searchPlaces', function() {
    return {
      require: 'ngModel',
      replace: true,
      scope: {
          ngModel: '=',
          latitude: '=',
          longitude: '=',
      },
      template: '<input class="form-control" type="text" placeholder="">',
      link: function(scope, element, attrs, model) {
        let options = {
            types: []
        };
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
  });
