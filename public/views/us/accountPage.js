angular.module('myApp', [])
.controller('AccountPageController', function($scope, $http) {
    console.log('hi');
    $scope.username = localStorage.getItem('user');
    console.log($scope.username);

    $http.get('http://localhost:3000/collections')
    .then(function(response) {
        const alluser = response.data;
        $scope.firstElements = alluser.filter(user => user.User === $scope.username);
        console.log($scope.firstElements);
    });

    $scope.openModal = function(item) {
        $http.get('http://localhost:3000/collections')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.filter(user => user.User === $scope.username);
            $scope.modalItems = theuser.find(piece => piece.Name === item).Items;
            console.log("modalitems" + $scope.modalItems);
        });
        console.log("yes");
        $scope.collectionName = item;
        $('#myModal').modal('show');
    };

    $scope.openNewCollection = function(item) {
        console.log($scope.username);
        console.log($scope.newCollectionName);
        $('#newCollectionModal').modal('show');
    };

    $scope.editCollection = function(item) {
        $('#editCollectionModal').modal('show');
        $scope.iteminediting = item;
    };

    $scope.creatingCollection = function() {
        console.log("Hi");
        console.log($scope.username);
        console.log($scope.newCollectionName);
        const newcollection = {
            User: $scope.username,
            Name: $scope.newCollectionName,
            Items: [],
        }

        $http.post('http://localhost:3000/collections', newcollection)
        .then(function(response) {
            alert('Creating collection successful');
        })
        .catch(function(error) {
            alert('Error while creating collection.');
            console.error(error);
        });
    }

    $scope.editingCollection = function() {
        console.log("hi")
        $http.get('http://localhost:3000/collections')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.filter(user => user.User === $scope.username);
            console.log(theuser);
            const collectionID = theuser.find(piece => piece.Name === $scope.iteminediting)._id;
            console.log(collectionID);
            $http.put('http://localhost:3000/collections/' + collectionID, { Name: $scope.editCollectionName })
                .then(function(response) {
                    console.log('Collection updated successfully:');
                })
                .catch(function(error) {
                    console.error('Error updating collection:', error);
                });
        });
    }

    $scope.removeCollection = function(item) {
        $http.get('http://localhost:3000/collections')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.filter(user => user.User === $scope.username);
            const collectionID = theuser.find(piece => piece.Name === item)._id;
            if (confirm('Are you sure you want to delete this collection?')) {
                fetch('http://localhost:3000/collections', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: collectionID,
                    }),
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    if (!response.ok) {
                        throw new Error('Failed to delete collection');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Collection deleted successfully:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    }

    $scope.removeFromCollection = function(itemname, collectionname) {
        $http.get('http://localhost:3000/collections')
        .then(function(response) {
            const alluser = response.data;
            const theuser = alluser.filter(user => user.User === $scope.username);
            console.log(theuser);
            const collectionID = theuser.find(piece => piece.Name === collectionname)._id;
            console.log(collectionID);
            console.log(itemname);
            $http.put('http://localhost:3000/removeFromCollections/' + collectionID, { removeitemfromset: itemname})
                .then(function(response) {
                    console.log('Collection updated successfully:');
                })
                .catch(function(error) {
                    console.error('Error updating collection:', error);
                });
        });
    }

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
            alert("The password and the confirm password is not the same!");
        }
    }

    $scope.createCollection = function() {
        const userName = $scope.username;

        $http.put('http://localhost:3000/append-new-collection', { username: userName, arrayname:  $scope.newCollectionName})
        .then(function(response) {
            console.log('Empty array appended:', response.data);
            if ($scope.user.collection) {
                $scope.user.collection.push([$scope.newCollectionName]);
            }
        })
        .catch(function(error) {
            console.error('Error appending empty array:', error);
        });
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
                localStorage.removeItem('user');
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