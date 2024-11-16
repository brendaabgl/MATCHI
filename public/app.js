angular.module('myApp', [])
  .controller('PiecesController', function($scope, $http) {
    // Fetch data from the server
    $http.get('http://localhost:3000/pieces')
      .then(function(response) {
        // Store the fetched pieces in the $scope object
        $scope.pieces = response.data;

        // Filter pieces with the "spring" tag
        $scope.springs = $scope.pieces.filter(piece => piece.Tags.includes("spring"));
        console.log("Filtered pieces with 'spring':", $scope.springs);
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
      });

    // Function to add a new piece
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
          // Add the new piece to the pieces array
          $scope.pieces.push(newPiece);

          // Update filtered results for "spring" tag if applicable
          if (newPiece.Tags.includes("spring")) {
            $scope.springs.push(newPiece);
          }
        })
        .catch(function(error) {
          console.error('Error adding piece:', error);
        });
    };
  });
