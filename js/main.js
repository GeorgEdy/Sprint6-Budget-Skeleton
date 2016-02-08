var app = angular.module('myApp', ['ngRoute']);

app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider.when("/",
        {
            templateUrl: 'history.html',
            controller: "AddCtrl"
        })
        .when('/spend.html',
            {
                templateUrl: 'spend.html',
                controller: "AddCtrl"
            })
        .when('/receive.html',
            {
                templateUrl: 'receive.html',
                controller: "AddCtrl"
            })
        .otherwise({
            templateUrl: 'history.html',
            controller: "AddCtrl"
        });
});

app.controller('AddCtrl', function ($scope, TransactionStore) {
    $scope.transactions = [];
    TransactionStore.getTransactionsInMonth(moment().format('YYYY-MM')).then(function (items) {
        $scope.transactions = items;
    });
});

app.factory('TransactionStore', function ($http, $q) {
    return (function () {
        var URL = 'http://server.godev.ro:8080/api/george/transactions';

        var getTransactionsInMonth = function (month) {
            return $q(function (resolve, reject) {
                $http({url: URL + '?month=' + month})
                    .then(
                        function (xhr) {
                            if (xhr.status == 200) {
                                resolve(xhr.data);
                            } else {
                                reject();
                            }
                        },
                        reject
                    );
            });
        };

        var add = function (data) {
            return $q(function (resolve, reject) {
                $http({
                    url: URL,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data)
                })
                    .then(
                        function (xhr) {
                            if (xhr.status == 201) {
                                resolve(xhr.data);
                            } else {
                                reject();
                            }
                        },
                        reject
                    );
            });
        };

        var del = function (id) {
            return $q(function (resolve, reject) {
                $http({
                    url: URL + '/' + id,
                    method: 'DELETE'
                })
                    .then(
                        function (xhr) {
                            if (xhr.status == 204) {
                                resolve();
                            } else {
                                reject();
                            }
                        },
                        reject
                    );
            });
        };

        return {
            getTransactionsInMonth: getTransactionsInMonth,
            add: add,
            delete: del
        };
    })();
});

$(document).ready(function () {
    $('.input-group.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });
});