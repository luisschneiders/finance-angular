angular.module('MyApp')
  .directive('customScripts', ['AppStatusServices', 'GOOGLE_MAP_KEY', function(AppStatusServices, GOOGLE_MAP_KEY) {
    return {
      template: function() {
        let scripts = [];
        let appStatus = AppStatusServices;

        if (appStatus.onLine) {
          scripts = [`<script src='https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places' async defer></script>`]
        }

        return scripts;
      }
    }
  }]);
