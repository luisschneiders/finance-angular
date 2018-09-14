angular.module('MyApp')
  .directive('customScripts', ['AppStatusServices', function(AppStatusServices) {
    return {
      template: function() {
        let scripts = [];
        let appStatus = AppStatusServices;

        if (appStatus.onLine) {
          scripts = ["<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBmIGyld82_bPAst5Fh0xRA6vkmOUKdLSQ&libraries=places' async defer></script>"]
        }

        return scripts;
      }
    }
  }]);
