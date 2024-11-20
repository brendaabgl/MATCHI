angular.module('myApp', [])
.controller('TextileController', function($scope, $http) { 

    $scope.color = '';
    $scope.season = '';
    $scope.piece = '';

    $http.get('http://localhost:3000/textile')
      .then(function(response) {
        const params = new URLSearchParams(window.location.search);

        const name = params.get('name');
        $scope.pieces = response.data;
        if (name) {
            $scope.textile = $scope.pieces.find(piece => piece.Name === name);
        }
        console.log($scope.pieces);

      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
      });

      $scope.isVisible = false;
      $scope.filterShow = function(){
        $scope.isVisible = !$scope.isVisible;
      }
      $scope.submitFilter = function() {
        const selectedSeason = $scope.season || 'none';
        const selectedColor = $scope.color || 'none';
        const selectedPiece = $scope.piece || 'none';

        const link = 'browse.html?piece='+selectedPiece+'&color='+selectedColor+'&season='+selectedSeason;
        window.location.href = link;
      };
    })