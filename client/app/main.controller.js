angular.module('mainController', ['ngCookies'])
  .controller('mainController', ['$scope', '$cookies', '$timeout', 'mainService', 
      function($scope, $cookies, $timeout, mainService) {

        $scope.coordsSettings = {
          precision: 6,
          step: 0.000001
        }

        $scope.formData = {
          coords: {
            latitude: 51.782065,
            longitude: 19.459279
          },
          mainObject: {
            maxDistance: 1000, // meters or seconds
            param: {
              key: 0,
              value: 0
            },
            timeReachOn: false,
          },
          relativeObject: {
            applicable: false,
            maxDistance: 500,
            params: []
          }
        }
        
        // parameters of OSM objects (nodes, ways, relations), got from server api
        $scope.objectParams = []

        $scope.init = function() {
          if($cookies["location"] === undefined) {            
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position){
              
              $scope.formData.coords.latitude = position.coords.latitude.toFixed($scope.location.precision)
              $scope.formData.coords.longitude = position.coords.longitude.toFixed($scope.location.precision)
              
              $cookies["location"] = $scope.location.latitude + '_' + $scope.location.longitude
              
              $timeout(function() { 
                  window.location.href = "/"
                }, 200);
              }, function() {
                $cookies["location"] = "none"
              });
            }
          } else if($cookies["location"] != "none")  {          
            loc = $cookies["location"].split('_')
            $scope.formData.coords.latitude = parseFloat(loc[0])
            $scope.formData.coords.longitude = parseFloat(loc[1])
          }

          mainService.getObjectParams((response) => {
            $scope.objectParams = response.data;
          });
        }

        $scope.searchForLocations = function() {
          console.log('SUBMITTED');
          mainService.submitSearchRequest($scope.formData, function() {
            console.log('FINISHED');
          });
        }
      }
]);
