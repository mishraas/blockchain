'use strict';

(function() {
    var appheaderController = function(userService, $router, $rootScope, $location) {
        var $ctrl = this;
        console.log("ROUTER APPHEADER", $router);
        $ctrl.logout = function(event) {
            event.preventDefault();
            userService.logout().then(function() {
                updateHeaderMenu(false);
                $router.navigate(['Login']);
            }, function() {

            });
        };
         $ctrl.isActive = function (viewLocation) { 
            return viewLocation.toLowerCase() === $location.path().replace('/','').toLowerCase();
        };

        var updateHeaderMenu = function(userLoggedIn) {
            if (userLoggedIn) {
                $ctrl.menuItems = [{
                    name: 'LoanDetails',
                    title: 'New Loan'
                }, {
                    name: 'LoanListing',
                    title: 'Loan Listing'
                }];

                var currentUser = userService.getLoggedInUser();
                $ctrl.loginInfo = {
                    userId: currentUser && currentUser.userName,
                    userName: currentUser && currentUser.userName,
                    logoutLink: 'logout'
                };
            } else {
                $ctrl.menuItems = [];
                $ctrl.loginInfo = {};
            }

            $ctrl.isAnonymous = !userLoggedIn;
        };

        $rootScope.$on('login', function() {
            updateHeaderMenu(true);
        });

        updateHeaderMenu(!userService.isAnonymous());

    };

    appheaderController.$inject = ['userService', '$router', '$rootScope', '$location'];
    var componentConfig = {
        // isolated scope binding
        bindings: {
            menuItems: '<',
            loginInfo: '<'
        },
        templateUrl: 'sblocapp/appheader/appheader.html',
        controller: appheaderController
    };

    module.exports = angular.module('sblocapp').component('appHeader',
        componentConfig);

})();
