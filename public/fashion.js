angular.module('myApp', [])
.controller('PiecesController', function($scope, $http) {
  let name;
    $http.get('http://localhost:3000/pieces')
      .then(function(response) {
        const params = new URLSearchParams(window.location.search);
        $scope.username = localStorage.getItem('user');
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

          $http.get('http://localhost:3000/comment')
          .then(function(response) {
            $scope.comments = response.data.filter(item => item.productName === $scope.outfit.NameId);
          })
          .catch(function(error) {
            console.error('Error fetching comments:', error);
          });


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

    $scope.postComment = function() {
      try {
          const userName = localStorage.getItem('user'); 
  
          if (!userName || userName === null) {
              throw new Error("No username found in localStorage.");
          }
  
          if ($scope.newComment && $scope.outfit) {
              const newComment = {
                  userName: userName, 
                  comment: $scope.newComment, 
                  productName: $scope.outfit.NameId
              };
  
              $http.post('http://localhost:3000/comment', newComment)
                  .then(function(response) {
                      console.log('Comment added:', response.data);
                      $scope.comments.push(newComment);
                      $scope.newComment = '';
                  })
                  .catch(function(error) {
                      console.error('Error adding comment:', error);
                  });
          } else {
              alert('Please enter a comment.');
          }
      } catch (error) {
          // Handle errors gracefully
          console.error('Error:', error.message);
          alert('You must be logged in to post a comment.');
          // Optionally redirect to the registration page
          window.location.href = "views/us/regist.html";
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
    $http.get('http://localhost:3000/collections')
    .then(function(response) {
        const alluser = response.data;
        $scope.firstElements = alluser.filter(user => user.User === $scope.username);
        console.log("check");
        console.log($scope.firstElements);
        
        $scope.openModal = function() {
          console.log("hi");
          $('#collectionModal').modal('show');
        };
    });

    $scope.addToCollection = function(item) {
      $http.get('http://localhost:3000/collections')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.filter(user => user.User === $scope.username);
            console.log(theuser);
            const collectionID = theuser.find(piece => piece.Name === item)._id;
            console.log(collectionID);
            $http.put('http://localhost:3000/addToCollections/' + collectionID, { addtosetitem: $scope.outfit.NameId})
                .then(function(response) {
                    console.log('Collection updated successfully:');
                })
                .catch(function(error) {
                    console.error('Error updating collection:', error);
                });
        });
    }

  });
