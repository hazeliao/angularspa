'use strict';

angular.module('app')
    .controller('LoginCtrl', function ($scope, $location, UserService) {

        $scope.isAdmin = UserService.isAdmin;
        $scope.loginFailed = false;
        $scope.viewTitle = "Login";
        //console.log("LoginCtrl hit!");
        //console.log("wat");

        $scope.list = [];
        $scope.text = '';
        $scope.submit = function() {

            if ($scope.username && $scope.userpassword) {

                if ( this.text == '' )
                {
                    this.text = 'email: ' + $scope.username +
                        ' password:' + $scope.userpassword;
                }
                $scope.list.push(this.text);
                $scope.text = 'email: ' + $scope.username + ' password:' + $scope.userpassword;

                if ( UserService.tryToLogin($scope.username, $scope.userpassword) )
                {
                    console.log("LoginController successfull login! Moving user to /home!");
                    $location.path("/home");
                } else {
                    $scope.loginFailed = true;
                }
            }
        };
        $scope.dismissError = function()
        {
            $scope.loginFailed = false;
        }
    });