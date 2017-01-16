'use strict';

angular.module('app')
    .controller('HomeCtrl', function ($scope, ShoppingCartService) {

        //http://lorempixel.com/200/100/technics/
        $scope.viewTitle = "Available products";

        $scope.addToCart = function(productID)
        {
            console.log("Adding to cart productID: "+productID);

            //window.localStorage.setItem("items")
            //Update the shared service value with this product id that is has been bought!


            ShoppingCartService.addToShoppingCart(1, productID);
        }

        $scope.products = ShoppingCartService.products;
        /*
        var productsTemp = [];

        productsTemp.push(product1);
        productsTemp.push(product2);
        productsTemp.push(product3);

            Enable this for testing: "product in products track by $index"
        for (var i = 0; i < 32; i++) {
            var randomProduct = Math.floor((Math.random() * 3) + 1);
            if (randomProduct == 1) {
                productsTemp.push(product1);
                productsTemp[productsTemp.length-1].Price = Math.floor((Math.random() * 23) + 2);
            }

            if (randomProduct == 2) {
                productsTemp.push(product2);
                productsTemp[productsTemp.length-1].Price = Math.floor((Math.random() * 61) + 38);

            }
            if (randomProduct == 3) {
                productsTemp.push(product3);
                productsTemp[productsTemp.length-1].Price = Math.floor((Math.random() * 33) + 81);
            }

        }
         */


        /* First prototype
        $scope.products =
        [
            {
                "Name" : "Product A",
                "Country" : "Germany",
                "src" : "img/fakeproduct" + Math.floor((Math.random() * 3) + 1) + ".jpg"
            },{
                "Name" : "Product B",
                "Country" : "Sweden",
                "src" : "img/fakeproduct" + Math.floor((Math.random() * 3) + 1) + ".jpg"
            },{
                "Name" : "Product C",
                "Country" : "Mexico",
                "src" : "img/fakeproduct" + Math.floor((Math.random() * 3) + 1) + ".jpg"
            },{
                "Name" : "Product D",
                "Country" : "Austria",
                "src" : "img/fakeproduct" + Math.floor((Math.random() * 3) + 1) + ".jpg"
            }
        ];
        */

    });