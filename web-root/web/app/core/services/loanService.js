'use strict';

(function() {
    /*
     *  loanService
     *  Description
     *  loanService fetches and performs on the Loan Data.
     */

    angular.module('core.services')
        .service('loanService', ['$q', '$http',
            function($q, $http) {
                var baseApiUrl = '/api';
                var REQUEST_URL = {
                    getUsesOfLoanProceeds: baseApiUrl + '/getUsesOfLoanProceeds',
                    getCurrentRate: baseApiUrl + '/getCurrentRate',
                    getCollateralAccountList: baseApiUrl + '/getCollateralAccountList',
                    getAccountSecurities: baseApiUrl + '/getAccountSecurities',
                    saveLoanData: baseApiUrl + '/saveLoanData',
                    getLoanList: baseApiUrl + '/getLoanList',
                    getLoanDetails: baseApiUrl + '/getLoanDetails/{loanId}'

                };

                function getUsesOfLoanProceeds() {
                    return $http.get(REQUEST_URL.getUsesOfLoanProceeds);
                }

                function getCurrentRate() {
                    return $http.get(REQUEST_URL.getCurrentRate);
                }

                function getCollateralAccountList() {
                    return $http.get(REQUEST_URL.getCollateralAccountList);
                }

                function getAccountSecurities(params) {
                    return $http.post(REQUEST_URL.getAccountSecurities, params);
                }

                function saveLoanData(loanData) {
                    return $http.post(REQUEST_URL.saveLoanData, loanData, null);
                }

                function getLoanList(user) {
                    return $http.get(REQUEST_URL.getLoanList, { params: user });
                }

                function getLoanDetails(loanId) {
                    var params = {};
                    params.loanId = loanId;
                    return $http.get(REQUEST_URL.getLoanDetails.replace('{loanId}', loanId));
                }

                function calculateTotalCollateralAmount(collateralPositions) {
                    var totalCollateralAmount = 0;
                    collateralPositions.forEach(function(position) {
                        totalCollateralAmount += Number.parseInt(position.collateralValue);
                    });
                    return totalCollateralAmount;
                }

                return {
                    getUsesOfLoanProceeds: getUsesOfLoanProceeds,
                    getCurrentRate: getCurrentRate,
                    getCollateralAccountList: getCollateralAccountList,
                    getAccountSecurities: getAccountSecurities,
                    saveLoanData: saveLoanData,
                    getLoanList: getLoanList,
                    getLoanDetails: getLoanDetails,
                    calculateTotalCollateralAmount: calculateTotalCollateralAmount,
                    loanAmount: 0,
                    collateralAccountList: [],
                    selectedAccountList: []
                };
            }
        ]);

})();
