angular.module('mainController', ['ngCookies'])
  .controller('mainController', ['$scope', '$cookies', '$timeout', 'mainService', 
      function($scope, $cookies, $timeout, mainService) {

        $scope.location = {
          latitude: 51.782065,
          longitude: 19.459279,
          precision: 6,
          step: 0.000001
        }
           
        $scope.init = function() {

          if($cookies["location"] === undefined){            
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position){
              
              $scope.location.latitude = position.coords.latitude.toFixed($scope.location.precision)
              $scope.location.longitude = position.coords.longitude.toFixed($scope.location.precision)
              
              $cookies["location"] = $scope.location.latitude + '_' + $scope.location.longitude
              
              $timeout(function() { 
                  window.location.href = "/"
                }, 200);                
              
            }, function(){
              $cookies["location"] = "none"
            });
          }
        } else if($cookies["location"] != "none")  {          
          loc = $cookies["location"].split('_')
          console.log(loc)
          $scope.location.latitude = parseFloat(loc[0])
          $scope.location.longitude = parseFloat(loc[1])
        }
        }            

      }
]);
