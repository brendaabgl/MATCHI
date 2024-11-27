angular.module('myApp', [])
.controller('RegistrationController', function($scope, $http) {
    $scope.user = {
        username: '',
        email: '',
        password: '',
        collection: [],
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