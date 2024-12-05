function toggleSearch() {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('d-none');
}
function handleSearch(event) {
    event.preventDefault();
    const searchValue = document.getElementById('searchInput').value;
    window.location.href = "browse.html?name="+searchValue;
}

function selectFilter(btn) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.style.backgroundColor = '#ffffff';
        button.style.color = 'black';
    });
    btn.style.backgroundColor = '#000';
    btn.style.color = 'white';
}

let isSubscribed = false; 

function toggleSubscription() {
  const btnNavbar = document.getElementById("subscribeBtnNavbar");  
  const btnMain = document.getElementById("subscribeBtn");  
  
  if (isSubscribed) {
    alert("You have unsubscribed successfully.");
    btnNavbar.innerText = "Subscribe";  
    btnMain.innerText = "Subscribe";  
  } else {
    alert("Thank you for subscribing! We will provide you with the latest fashion updates.!");
    btnNavbar.innerText = "Unsubscribe";  
    btnMain.innerText = "Unsubscribe"; 
  }
  
  isSubscribed = !isSubscribed;  // Toggle the subscription status
}

function goToProfile() {
    console.log("clicked");
    let user = localStorage.getItem('user');
    console.log('Retrieved user:', user);
    if (user) {
        window.location.href = "/public/views/us/accountPage.html";
    }
    else {
        window.location.href = "/public/views/us/regist.html";
    }
}

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Thank you for submitting the form!");
});

function toggleSearch() {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('d-none');
}

//newsletter
const submitButton = document.getElementById('submitBtn');
const emailInput = document.getElementById('emailInput');
const responseMessage = document.getElementById('responseMessage');
const errorMessage = document.getElementById('errorMessage');

submitButton.addEventListener('click', function() {
    const email = emailInput.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailPattern.test(email)) {
        responseMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        emailInput.value = '';  
    } else {
        errorMessage.style.display = 'block';
        responseMessage.style.display = 'none';
    }
});


var app = angular.module('myApp', []);

app.controller('TextileController', function($scope, $http) { 

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

app.controller('PiecesController', function($scope, $http) {
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
                    window.location.href="fashion.html?name="+$scope.outfit.NameId
                })
                .catch(function(error) {
                    console.error('Error updating collection:', error);
                });
        });
    }

    });

app.controller('browserController', function($scope, $http) { 

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
          $scope.pieces = $scope.pieces.filter(item => item.Color.some(c => c.includes(color)));
        }
        if (season && season !== '' && season !== 'none') {
          $scope.pieces = $scope.pieces.filter(item => item.Tags.some(tag => tag.includes(season)));
        }
        if (piece && piece !== '' && piece !== 'none') {
          $scope.pieces = $scope.pieces.filter(item => item.Tags.some(tag => tag.includes(piece)));
        }        
        if (productname){
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

app.controller('AccountPageController', function($scope, $http) {
console.log('hi');
$scope.username = localStorage.getItem('user');
console.log($scope.username);
if ($scope.username==null) {
    console.log('Redirecting to registration page...');
    window.location.href = "/public/views/us/regist.html";
}

$http.get('http://localhost:3000/collections')
.then(function(response) {
    const alluser = response.data;
    $scope.firstElements = alluser.filter(user => user.User === $scope.username);
    console.log($scope.firstElements);
});

$http.get('http://localhost:3000/blogs')
    .then(function(response) {
        const params = new URLSearchParams(window.location.search);
        $scope.user = localStorage.getItem('user');
        $scope.blogs = response.data;
        $scope.userblog = $scope.blogs.filter(piece => piece.username === $scope.user);
        console.log("Matching blog:", $scope.userblog);

        $scope.deleteBlog = function (itemID) {
            if (confirm('Are you sure you want to delete this comment?')) {
                console.log(itemID);
                fetch('http://localhost:3000/blogs', {
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
                        window.location.href = 'accountPage.html';
                        return response.json();
                    })
                    .then(data => {
                        console.log('Comment deleted successfully:', data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                };
            }       
    })
    .catch(function(error) {
        console.error('Error fetching data:', error);
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
        window.location.href = 'accountPage.html';
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
                alert('Collection updated successfully');  
                window.location.href = 'accountPage.html';
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
                window.location.href = 'accountPage.html';
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
                window.location.href = 'accountPage.html';
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
                    window.location.href = 'accountPage.html';
                    return response.json();
                })
                .then(data => {
                    console.log('Comment deleted successfully:', data);   
                    $scope.comments = $scope.comments.filter(comment => comment._id !== itemID);
                    $scope.$apply();
                    window.location.href = 'accountPage.html';
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

$scope.isBlogVisible = false;
$scope.blogShow = function(){
    $scope.isBlogVisible = !$scope.isBlogVisible;
}

$scope.editComment = function(itemID, comment) {
    console.log(itemID);
    console.log(comment);
    $http.put('http://localhost:3000/comment/' + itemID, { comment: comment })
    .then(function(response) {
        console.log('Comment updated successfully:', response.data);
        const updatedComment = response.data;
        const index = $scope.comments.findIndex(item => item._id === itemID);
        if (index !== -1) {
            $scope.comments[index].comment = updatedComment.comment;
        }
        window.location.href = 'accountPage.html';
    })
    .catch(function(error) {
        alert('Error updating comment:'+ JSON.stringify(error, null, 2));
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
                window.location.href = 'accountPage.html';
            })
            .catch(function(error) {
                alert('Error updating comment:' + JSON.stringify(error, null, 2));
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
        window.location.href = 'accountPage.html';
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
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            localStorage.removeItem('user');
            window.location.href = '../../homepage_views.html';
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

app.controller('RegistrationController', function($scope, $http) {
    $scope.user = {
        username: '',
        email: '',
        password: '',
    };

    $scope.signIn = function ($event) {
        $event.preventDefault();
        if ($scope.profileForm.$valid) {
            $http.get('http://localhost:3000/users')
            .then(function(response) {
                const users = response.data;
                const userExists = users.some(user => 
                    user.username === $scope.user.username || 
                    user.email === $scope.user.email 
                );

                if (userExists) {
                    alert('User with the same username and email already exists.');
                } else {
                    $http.post('http://localhost:3000/users', $scope.user)
                    .then(function(response) {
                        alert('Registration successful, please login');
                    })
                    .catch(function(error) {
                        alert('Error while registering user.');
                        console.error(error);
                    });
                }
            })
            .catch(function(error) {
                alert('Error while fetching users.');
                console.error(error);
            });
        } else {
            alert('Please fill out the form correctly.');
        }
    };

    $scope.logIn = function () {
        if ($scope.profileForm.$valid) {
            $http.get('http://localhost:3000/users')
            .then(function(response) {
                const users = response.data;
                const userExists = users.find(user => 
                    user.username === $scope.user.username && 
                    user.email === $scope.user.email &&
                    user.password === $scope.user.password
                );

                if (userExists) {
                    localStorage.setItem('user', userExists.username);
                    console.log('Stored username:', localStorage.getItem('user'));
                    window.location.href = 'accountPage.html';
                    
                } else {
                    alert('Incorrect Credentiallity, please try again or register')
                }
            })
            .catch(function(error) {
                alert('Error while fetching users.');
                console.error(error);
            });
        } else {
            alert('Please fill out the form correctly.');
        }
    };
});

app.controller('UserBlogController', function($scope, $http) {
    $scope.blog = {
        username: localStorage.getItem('user'),
        title: '',
        content: '',
    };

    $scope.submitBlog = function(event) {
        console.log("hi");
        console.log($scope.blog.title);
        console.log($scope.blog.content);
        try {
            if (!$scope.blog.username || $scope.blog.username === null) {
                alert("Please login first");
                window.location.href = "../us/regist.html";
            }
            else {
                $http.post('http://localhost:3000/blogs', $scope.blog)
                    .then(function(response) {
                        console.log('Comment added:', response.data);
                        $scope.blog.title = '';
                        $scope.blog.content = '';
                        window.location.href="../homepage_views.html";
                    })
                    .catch(function(error) {
                        console.error('Error adding comment:', error);
                    });
            }  
        } catch (error) {
            console.error('Error:', error.message);
            alert('You must be logged in to post a blog.');
        }
    }
});

app.controller('HomeController', function($scope, $http) {
    $http.get('http://localhost:3000/blogs')
      .then(function(response) {
        $scope.blogs = response.data;
    })
});

app.controller('CommunityBlogController', function($scope, $http) {
    $http.get('http://localhost:3000/blogs')
        .then(function(response) {
        const params = new URLSearchParams(window.location.search);
        $scope.username = localStorage.getItem('user');
        let blogID = params.get('id');

        $scope.blogs = response.data;

        if (blogID) {
            $scope.userblog = $scope.blogs.find(piece => piece._id === blogID);
            console.log("Matching blog:", $scope.userblog);
        }
        })
        .catch(function(error) {
        console.error('Error fetching data:', error);
        });
});

app.controller('EditBlogController', function ($scope, $http) {
    $http.get('http://localhost:3000/blogs')
    .then(function(response) {
    const params = new URLSearchParams(window.location.search);
    $scope.username = localStorage.getItem('user');
    let blogID = params.get('id');

    $scope.blogs = response.data;

    if (blogID) {
        $scope.userblog = $scope.blogs.find(piece => piece._id === blogID);
        console.log("Matching blog:", $scope.userblog);
        $scope.blog = {
            title: $scope.userblog.title,
            content: $scope.userblog.content,
        };
    }

    $scope.editBlog = function(event) {
        event.preventDefault();
        $http.put('http://localhost:3000/blogs/' + blogID, $scope.blog)
                .then(function(response) {
                    console.log('Collection updated successfully:');
                    window.location.href="../us/accountPage.html";
                })
                .catch(function(error) {
                    console.error('Error updating collection:', error);
                    alert('Error updating collection, please try again later' + JSON.stringify(error, null, 2));
                });
    }
    })
    .catch(function(error) {
    console.error('Error fetching data:', error);
    });

});