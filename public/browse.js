// function toggleRadio(radio) {
//   if (radio.checked) {
//     radio.previousValue = radio.checked; 
//     setTimeout(() => {
//       if (radio.previousValue) {
//         radio.checked = false;
//       }
//     }, 0); 
//   }
// }

angular.module('myApp', [])
.controller('browserController', function($scope, $http) { 

    $scope.color = '';
    $scope.season = '';
    $scope.piece = '';

    $http.get('http://localhost:3000/pieces')
      .then(function(response) {
        const params = new URLSearchParams(window.location.search);

        const color = params.get('color');
        const season = params.get('season');
        const piece = params.get('piece');
        const productname = params.get('name');

        console.log(piece);

        $scope.pieces = response.data;
        console.log($scope.pieces)
        if (color && color !== '' && color !== 'none') {
          console.log(color);
          $scope.pieces = $scope.pieces.filter(item => item.Color.some(c => c.includes(color)));
        }
        if (season && season !== '' && season !== 'none') {
          console.log(season);
          $scope.pieces = $scope.pieces.filter(item => item.Tags.some(tag => tag.includes(season)));
        }
        if (piece && piece !== '' && piece !== 'none') {
          console.log(piece);
          $scope.pieces = $scope.pieces.filter(item => item.Tags.some(tag => tag.includes(piece)));
        }        
        if (productname){
          console.log("hi" + productname);
          $scope.pieces = $scope.pieces.filter(item => item.Name.toLowerCase().includes(productname.toLowerCase()));
        }     
        console.log($scope.pieces)
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

    
    $scope.search = function() {
      if ($scope.searchQuery) {
          alert('Searching for: ' + $scope.searchQuery);
      } else {
          alert('Please enter a search query.');
      }
    };

    $scope.addPiece = function() {
      const newPiece = {
        Name: $scope.newName,
        Description: $scope.newDescription,
        Image: $scope.newImage,
        Color: $scope.newColors.split(','), 
        Tags: $scope.newTags.split(',')
      };

      $http.post('http://localhost:3000/pieces', newPiece)
        .then(function(response) {
          console.log('Piece added:', response.data);
          $scope.pieces.push(newPiece);
          if (newPiece.Tags.includes("spring")) {
            $scope.springs.push(newPiece);
          }
        })
        .catch(function(error) {
          console.error('Error adding piece:', error);
        });
    };
  });
