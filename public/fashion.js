angular.module('myApp', [])
.controller('PiecesController', function($scope, $http) {
  let name;
    $http.get('http://localhost:3000/pieces')
      .then(function(response) {
        const params = new URLSearchParams(window.location.search);
        name = params.get('name');
        console.log("Name from URL:", name);

        $scope.pieces = response.data;

        if (name) {
          $scope.outfit = $scope.pieces.find(piece => piece.NameId === name);
          console.log("Matching piece:", $scope.outfit);
          if ($scope.outfit.Tags.includes("summer")) {
            $scope.icon = "sun";
            $scope.iconColor = "#FBD248"
          } else if($scope.outfit.Tags.includes("winter")) {
            $scope.icon = "snow"
            $scope.iconColor = "#89CFF0"
          } else if($scope.outfit.Tags.includes("autumn")) {
            $scope.icon = "tree"
            $scope.iconColor = "#D42900"
          } else {
            $scope.icon = "flower2"
            $scope.iconColor = "#FF69B4"
          }
        }
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
      });
    
    $scope.search = function() {
      if ($scope.searchQuery) {
          alert('Searching for: ' + $scope.searchQuery);
      } else {
          alert('Please enter a search query.');
      }
    };

    $http.get('http://localhost:3000/comment').then(function(response) {
      $scope.comments = response.data;
      $scope.comments = $scope.comments.filter(item => item.productName === $scope.outfit.NameId);
    });

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
