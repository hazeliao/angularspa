'use strict';

angular.module('app')
    .controller('UserInfoCtrl', function ($scope, $location, UserService) {

        $scope.viewTitle = "Your User Information:";

        if ( UserService.isLoggedIn == true ) {
            $scope.firstName = "todo: fetch from db";
            $scope.lastName = "todo: fetch from db";
            $scope.eMail = UserService.currentUserName;
            if ( UserService.productsPurchased )
            {
                $scope.productsPurchased = UserService.productsPurchased.length;
            } else {
                $scope.productsPurchased = '0';
            }

        } else {
            $scope.firstName            = "Unknown";
            $scope.lastName             = "Unknown";
            $scope.eMail                = "Unknown";
            $scope.productsPurchased    = "Unknown";
        }

    });