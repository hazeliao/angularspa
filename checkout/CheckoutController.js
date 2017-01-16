'use strict';

angular.module('app')
    .controller('CheckoutCtrl', function ($scope, ShoppingCartService) {

        console.log("CheckoutCtrl hit!");

        //http://lorempixel.com/200/100/technics/

        $scope.viewTitle = "Checkout";

        /**************************************************************************
         *
         *  List only unique products with their counts
         *
         **************************************************************************/;
        $scope.uniqueProductsInShoppingCart = ShoppingCartService.uniqueProductsInShoppingCart;

        $scope.getCountOfProducts = function(productID)
        {
            return ShoppingCartService.getCountOfProductID(productID);
        }

        $scope.resetCart = function()
        {
            $scope.uniqueProductsInShoppingCart = [];
            ShoppingCartService.clearShoppingCart();
        }

        /**************************************************************************
         *  NOTE: Debug / Admin -features
         **************************************************************************/
        $scope.addProduct = function()
        {
            ShoppingCartService.addToShoppingCart(1, 0);
            $scope.uniqueProductsInShoppingCart = ShoppingCartService.uniqueProductsInShoppingCart;
        }

        $scope.removeProduct = function()
        {
            ShoppingCartService.removeFromShoppingCart(1, 0);
            $scope.uniqueProductsInShoppingCart = ShoppingCartService.uniqueProductsInShoppingCart;
        }

    });