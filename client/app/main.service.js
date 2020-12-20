angular.module('mainService', [])
  .service('mainService',
    function($http) {

      this.submitSearchRequest = function(data, callback) {
        return $http.post('/location-search', data).then(callback);
      },

      this.getObjectParams = function(callback) {
        return $http.get('/api/object-params').then(callback);
      }
    }
  );
