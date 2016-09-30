'use strict';

(function() {

    var sblocappController = function() {
        
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
            component: 'loanDetails',
            useAsDefault:true
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
