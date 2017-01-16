'use strict';

var app = angular.module('app', [ 'ngRoute' ]);

app.service('UserService', function() {

    /**********************************
     * Default logins, for testing.
     **********************************/
    this.tempUserContainer = [];
    var defaultUser = { 'username' : 'user@user.com', 'password' : 'password', 'isAdmin' : 'false' };
    var defaultAdmin = { 'username' : 'admin@admin.com', 'password' : 'password', 'isAdmin' : 'true' };
    this.tempUserContainer.push ( defaultUser );
    this.tempUserContainer.push ( defaultAdmin );

    this.callbacks = []; //NOTE: Used to update any controllers view that needs login change state.
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.currentUserName = "Not logged in";

    this.registerUser = function(username, password)
    {
        //First check if this user already exists, if so, return false.
        for ( var i = 0; i < this.tempUserContainer.length; i++ )
        {
            if ( this.tempUserContainer[i].username === username )
            {
                return false; //User already exists! Can't register ontop of one!
            }
        }
        this.tempUserContainer.push(username, password);
        return true;
    }

    this.tryToLogin = function (username, password) {
        console.log("Trying login: " + username + ' password: ' + password);

        //Find the user & pw combo from all the users created.
        for ( var i = 0; i < this.tempUserContainer.length; i++ ) {
            if (this.tempUserContainer[i].username === username && this.tempUserContainer[i].password === password) {
                if ( this.tempUserContainer[i].isAdmin === 'true' )
                {
                    console.log("Admin login detected!");
                    this.isAdmin = true;
                } else {
                    console.log("Normal user login detected!");
                    this.isAdmin = false;

                }

                this.currentUserName = username;
                window.localStorage.setItem("is_logged_in", true);
                window.localStorage.setItem("username", username);
                window.localStorage.setItem("password", password);
                this.isLoggedIn = true;
                this.triggerCallbacks();
                return true;
            }

        }

        console.log("Login failed :( Perhaps password was wrong?");
        return false;

    }

    this.logout = function () {
        console.log("Logging out username: ", this.currentUserName);
        window.localStorage.setItem("is_logged_in", false);
        window.localStorage.setItem("username", '');
        window.localStorage.setItem("password", '');
        this.currentUserName = "";
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userEmail = "";
        this.userPassword = "";
        this.triggerCallbacks();
    }

    this.addUpdateCallback = function (callback) {
        //First check if the callback doesn't already exist.
        for (var i = 0; i < this.callbacks.length; i++) {
            if (this.callbacks[i] === callback) {
                return; //callback already existed, don't push it in again.
            }
        }
        this.callbacks.push(callback);
    }

    this.triggerCallbacks = function () {
        for (var i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i]();
        }
    }

    /********************************************************************
     * HTML5 LocalStorage for persistant logins
     ********************************************************************/
    var isLoggedInAlready = window.localStorage.getItem("is_logged_in");
    if ( isLoggedInAlready === 'true' )
    {
        var oldUsername = window.localStorage.getItem("username");
        var oldPassword = window.localStorage.getItem("password");
        if ( oldUsername.length > 0 && oldPassword.length > 0 )
        {
            if ( this.tryToLogin(oldUsername, oldPassword) )
            {
                console.log("Session based re-login succeeded!");
            } else{
                console.log("Session based re-login failed!");
            }
        }
    }
});

app.service('ShoppingCartService', function() {
    /**************************************************************************
     *
     *  Fake product listing, until real backend comes along.
     *
     **************************************************************************/
    this.products = [];
    var product1 =
    {
        "Name" : "Rubiks Cube",
        "ID" : 0,
        "Country" : "Hungary",
        "Price" : 10,
        "Image" : "img/fakeproduct1.jpg"
    };

    var product2 =
    {
        "Name" : "Poeme Perfume",
        "ID" : 1,
        "Country" : "France",
        "Price" : 50,
        "Image" : "img/fakeproduct2.jpg"
    };

    var product3 =
    {
        "Name" : "Beats Headphones",
        "ID" : 2,
        "Country" : "China",
        "Price" : 99,
        "Image" : "img/fakeproduct3.jpg"
    };

    /**************************************************************************
     *  NOTE: Order of pushing is critical, ID and indices used in referencing.
     **************************************************************************/
    this.products.push(product1);
    this.products.push(product2);
    this.products.push(product3);

    /**************************************************************************
     *
     *  Critical performance optimized callback update of data to views.
     *
     **************************************************************************/
    this.shoppingCartItems = [];
    this.uniqueProductsInShoppingCart = [];
    this.boughtProducts = [];

    this.saveUpdateCallback = function(updateCallback)
    {
        this.updateCallback = updateCallback;
    }

    this.addToShoppingCart = function(num, productID)
    {
        console.assert(productID <  this.products.length);
        for ( var i = 0; i < num; i++ ) {
            this.shoppingCartItems.push(this.products[productID])
        }

        //Keep updated the unique item count.
        if ( num > 0 ) {
            this.recalculateUniqueItems();
        }

        /*********************************************************************
         * Temporary persistent storage in html5 storage instead of database
         *********************************************************************/
        window.localStorage.setItem("productsInCart", JSON.stringify(this.shoppingCartItems));
        window.localStorage.setItem("uniqueProductsInCart", JSON.stringify(this.uniqueProductsInShoppingCart));

        this.updateCallback();
    }

    this.removeFromShoppingCart = function(num, productID)
    {
        console.assert(productID < this.products.length);
        var targetAttempts = num;
        for ( var i = 0; i < this.shoppingCartItems.length; i++ ) {

            //Remove if matching product ID found.
            if ( this.shoppingCartItems[i] == this.products[productID] ) {
                this.shoppingCartItems.splice(i, 1);
                targetAttempts--;
                if (targetAttempts <= 0) {
                    //This means we have deleted the required amount of the product in question.
                    break;
                }
            }
        }

        //Keep updated the unique item count.
        if ( num > 0 ) {
            this.recalculateUniqueItems();
        }

        this.updateCallback();
    }

    this.getCountOfProductID = function(productID)
    {
        console.assert(productID < this.products.length);
        var result = 0;
        for ( var i = 0; i < this.shoppingCartItems.length; i++ )
        {
            if ( this.shoppingCartItems[i].ID == productID )
            {
                result++;
            }
        }
        return result;
    }

    /**************************************************************************
     *  NOTE: This keeps available a list of unique items for quick use.
     **************************************************************************/
    this.recalculateUniqueItems = function()
    {
        var uniqueItems = [];

        for ( var i = 0; i < this.shoppingCartItems.length; i++ )
        {
            //Search if this item already exists on this list?
            var isItemOnListAlready = false;
            for ( var a = 0; a < uniqueItems.length; a++ )
            {
                if ( uniqueItems[a].ID == this.shoppingCartItems[i].ID )
                {
                    isItemOnListAlready = true;
                }
            }
            if ( isItemOnListAlready == false )
            {
                uniqueItems.push(this.shoppingCartItems[i]);
            }
        }
        this.uniqueProductsInShoppingCart = uniqueItems;
    }

    this.clearShoppingCart = function()
    {
        //Cut the array in pieces.
        this.shoppingCartItems = [];//.splíce(0, this.shoppingCartItems.length);
        this.uniqueProductsInShoppingCart = [];
        window.localStorage.setItem("productsInCart", '');
        window.localStorage.setItem("uniqueProductsInCart", '');
        window.localStorage.setItem("boughtProducts", '');
        this.updateCallback();
    }

    /********************************************************************
     * HTML5 LocalStorage for persistant checkout data
     ********************************************************************/
    var inCart = window.localStorage.getItem("productsInCart")
    if ( inCart && inCart.length > 0 )
        this.shoppingCartItems = JSON.parse(window.localStorage.getItem("productsInCart"));

    var uniqueInCart = window.localStorage.getItem("uniqueProductsInCart");
    if ( uniqueInCart && uniqueInCart.length > 0 )
        this.uniqueProductsInShoppingCart = JSON.parse(window.localStorage.getItem("uniqueProductsInCart"));

    var bought = window.localStorage.getItem("boughtProducts");
    if ( bought && bought.length > 0 )
        this.boughtProducts = JSON.parse(window.localStorage.getItem("boughtProducts"));

});

app.controller('MainCtrl', function ($scope, $location, ShoppingCartService, UserService) {

    $scope.userName = "";
    /**************************************************************************
     *  This removes the 'register' and 'login' buttons, if user is logged in.
     **************************************************************************/
    $scope.updateLoginState = function()
    {
        $scope.isLoggedIn   = UserService.isLoggedIn;
        $scope.isAdmin      = UserService.isAdmin;
        $scope.userName     = UserService.currentUserName;
    }
    UserService.addUpdateCallback($scope.updateLoginState);
    $scope.doLogout = function()
    {
        UserService.logout();
    }
    /**************************************************************************
     *
     *  This enables other controllers to update the shopping cart item count.
     *
     **************************************************************************/
    $scope.updateCartItemsNow = function()
    {
        console.log("Update callback of MainCtrl triggered!");
        $scope.itemsInCart = ShoppingCartService.shoppingCartItems.length;
    }
    ShoppingCartService.saveUpdateCallback($scope.updateCartItemsNow);


    if ( window.localStorage.getItem("is_logged_in") )
    {
        $scope.updateLoginState();
        $scope.updateCartItemsNow();
    }
    /**************************************************************************
     *
     *  This enables tracking of navigation bar active state visually.
     *
     **************************************************************************/
    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
    };

    $location.path("/home");
});

app.config(['$routeProvider',
    function (
        $routeProvider
    ) {
        $routeProvider
        .when('/', {
            abstract: true,
            controller: 'MainCtrl'
        })
        .when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        })
        .when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/aboutus', {
            templateUrl: 'aboutus/aboutus.html',
            controller: 'AboutUsCtrl'
        })
        .when('/register', {
            templateUrl: 'register/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/checkout', {
            templateUrl: 'checkout/checkout.html',
            controller: 'CheckoutCtrl'
        })
        .when('/userinfo', {
            templateUrl: 'userinfo/userinfo.html',
            controller: 'UserInfoCtrl'
        })
        .otherwise({
            redirectTo: "/home"
        });
    }]);

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

angular.module('app').directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);