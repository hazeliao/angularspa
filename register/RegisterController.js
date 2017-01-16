'use strict';

angular.module('app')
    .controller('RegisterCtrl', function ($scope, ShoppingCartService) {

        //console.log("RegisterCtrl hit!");

        //http://lorempixel.com/200/100/technics/

        $scope.viewTitle = "Register an account";

        $scope.list = [];
        $scope.text = '';
        $scope.submit = function() {
            console.log("submit hit!");

            ShoppingCartService.addToShoppingCart(1);

            if ($scope.firstname && $scope.lastname && $scope.useremail && $scope.userpassword) {

                if ( this.text == '' )
                {
                    this.text = 'fname: ' + $scope.firstname +
                        ' lname: ' + $scope.lastname +
                        ' email:' + $scope.useremail +
                        ' password:' + $scope.userpassword;
                }
                $scope.list.push(this.text);
                $scope.text =   'fname: ' + $scope.firstname +
                                ' lname: ' + $scope.lastname +
                                ' email:' + $scope.useremail +
                                ' password:' + $scope.userpassword;
            }
        };

    });