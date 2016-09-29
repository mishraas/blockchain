'use strict';

(function() {

    var sblocappController = function($router) {
        console.log("ROUTER SBLOC APP: ", $router);
    };

    sblocappController.$inject = ['$router'];

    var componentConfig = {
        // isolated scope binding
        bindings: {
            message: '<'
        },
        templateUrl: 'sblocapp/sblocapp.html',
        controller: sblocappController,
        $routeConfig: [{
            path: '/loandetails',
            name: 'LoanDetails',
            component: 'loanDetails'
        }, {
            path: '/loanlisting',
            name: 'LoanListing',
            component: 'loanListing'
        }, {
            path: '/login',
            name: 'Login',
            component: 'login'
        }]
    };

    module.exports = angular.module('sblocapp')
        .component('sblocApp', componentConfig);

})();
