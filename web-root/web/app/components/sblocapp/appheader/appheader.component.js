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

        $ctrl.isActive = function(viewLocation) {
            return viewLocation.toLowerCase() === $location.path().split('/')[1].toLowerCase();
        };

        var updateHeaderMenu = function(userLoggedIn) {
            if (userLoggedIn) {
                $ctrl.menuItems = [{
                    name: 'LoanListing',
                    title: ' Home',
                    icon: 'glyphicon glyphicon-home'
                }, {
                    name: 'LoanDetails',
                    title: ' Loan Details',
                    icon: 'glyphicon glyphicon-list'
                }];

                var currentUser = userService.getLoggedInUser();
                $ctrl.loginInfo = {
                    userId: currentUser && currentUser.userName,
                    userName: currentUser && currentUser.userName,
                    fullName: (currentUser && currentUser.firstName) + ' ' + (currentUser && currentUser.lastName),
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

        $rootScope.$on('navButton', function(event, data) {
            $ctrl.hideNavButtonFlag = data.status;
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
