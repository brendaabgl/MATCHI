angular.module('myApp', [])
.controller('AccountPageController', function($scope, $http) {
    console.log('hi');
    $scope.username = localStorage.getItem('user');
    console.log($scope.username);

    $http.get('http://localhost:3000/users')
    .then(function(response) {
        const alluser = response.data;
        const theuser = alluser.find(user => user.username === $scope.username);
        if (theuser && theuser.collection) {
            $scope.firstElements = theuser.collection.map(array => {
                if (Array.isArray(array) && array.length > 0) {
                    return array[0]; 
                }
                return null;
            }).filter(element => element !== null);
        } else {
            console.warn('No matching user or no collection found.');
            $scope.firstElements = [];
        }

        console.log($scope.firstElements);
    });

    $scope.openModal = function(item) {
        $http.get('http://localhost:3000/users')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.find(user => user.username === $scope.username);
            if (theuser && theuser.collection) {
                const matchingArray = theuser.collection.find(array => {
                    return Array.isArray(array) && array[0] === item;
                });
            
                if (matchingArray) {
                    console.log('Found matching array:', matchingArray);
                    $scope.collectionName = matchingArray[0];
                    matchingArray.shift();
                    $scope.modalItems = matchingArray; 
                } else {
                    console.warn('No matching array found with first element:', itemToMatch);
                    $scope.modalItems = [];  
                }
            } else {
                console.warn('No matching user or no collection found.');
                $scope.modalItems = [];
            }

            console.log($scope.modalItems);
        });
        console.log("yes");
        $('#myModal').modal('show');
    };

    $scope.removeArray = function(arrayNameToRemove) {
        console.log(arrayNameToRemove);
        $http.get('http://localhost:3000/users')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.find(user => user.username === $scope.username);
            const matchingArray = theuser.collection.find(array => {
                return Array.isArray(array) && array[0] === arrayNameToRemove;
            });
            console.log(matchingArray);
            $http.put('http://localhost:3000/remove-array', {
                username: $scope.username,
                arrayToRemove: matchingArray
            }).then(function(response) {
                console.log('Array removed:', response.data);
                const index = $scope.user.collection.indexOf(matchingArray);
                if (index > -1) {
                    $scope.user.collection.splice(index, 1);
                }
            }).catch(function(error) {
                console.error('Error removing array:', error);
            });
        });
    };

    $http.get('http://localhost:3000/comment')
    .then(function(response) {
        $scope.comments = response.data.filter(item => item.userName === $scope.username);

        $scope.deleteComment = function (itemID) {
            if (confirm('Are you sure you want to delete this comment?')) {
                console.log(itemID);
                fetch('http://localhost:3000/comment', {
                    method: 'DELETE', 
                    headers: {
                      'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({
                      id: itemID, 
                    }),
                  })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Failed to delete comment');
                      }
                      return response.json();
                    })
                    .then(data => {
                        console.log('Comment deleted successfully:', data);   
                        $scope.comments = $scope.comments.filter(comment => comment._id !== itemID);
        
                        $scope.$apply();
                    })
                    .catch(error => {
                      console.error('Error:', error);
                    });
                };
            }       
    })
    .catch(function(error) {
        console.error('Error fetching comments:', error);
    });

    $scope.isVisible = false;
    $scope.filterShow = function(){
        $scope.isVisible = !$scope.isVisible;
    }

    $scope.isEditing = false;
    $scope.showEditComment = function(){
        $scope.isEditing = !$scope.isEditing;
    }

    $scope.editComment = function(itemID, comment) {
        console.log(itemID);
        console.log(comment);
        $http.put('http://localhost:3000/comment/' + itemID, { comment: comment })
        .then(function(response) {
            console.log('Comment updated successfully:', response.data);
            const updatedComment = response.data.data;
            const index = $scope.comments.findIndex(item => item._id === itemID);
            if (index !== -1) {
                $scope.comments[index].comment = updatedComment.comment;
            }
        })
        .catch(function(error) {
            console.error('Error updating comment:', error);
        });
    }

    $scope.passwordShow = false;
    $scope.showEditPassword = function(){
        $scope.passwordShow = !$scope.passwordShow;
    }

    $scope.editPassword = function(newPassword, confirmPassword){
        if(newPassword === confirmPassword){
            $http.get('http://localhost:3000/users')
            .then(function(response) {
                const alluser = response.data;
                const theuser = alluser.find(user => user.username === $scope.username);
                const userID = theuser._id;
                $http.put('http://localhost:3000/users/' + userID, { password: newPassword })
                .then(function(response) {
                    console.log('Password updated successfully:');
                })
                .catch(function(error) {
                    console.error('Error updating comment:', error);
                });
            });
        }
        else {
            alert("The password and the confirm password is not the same!")
        }
    }


    
    $scope.deleteAccount = function() {
        $http.get('http://localhost:3000/users')
        .then(function(response) {
        const alluser = response.data;
        const theuser = alluser.find(user => user.username === $scope.username);
        const userID = theuser._id;
        console.log(userID);
        if (confirm('Are you sure you want to delete this account?')) {
            fetch('http://localhost:3000/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userID,
                }),
            })
            .then(response => {
                console.log('Response status:', response.status); // Check the response status
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                return response.json();
            })
            .then(data => {
                console.log('User deleted successfully:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        })
    };

    $scope.logOut = function() {
        localStorage.removeItem('user');
        window.location.href = 'regist.html';
    }

    $http.get('http://localhost:3000/pieces')
      .then(function(response) {
        const pieces = response.data;
        console.log(pieces);
        $scope.getImage = function(item) {
            const theItem = pieces.find(piece => piece.NameId === item);
            return theItem.Image;
        }
        $scope.getName = function(item) {
            const itemName = pieces.find(piece => piece.NameId === item);
            return itemName.Name;
        }
    });

});