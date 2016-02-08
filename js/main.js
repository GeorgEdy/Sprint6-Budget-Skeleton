var app = angular.module('myApp', ['ngRoute']);

app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider.when("/",
        {
            templateUrl: 'history.html',
            controller: "GetCtrl"
        })
        .when('/spend.html',
            {
                templateUrl: 'spend.html',
                controller: "GetCtrl"
            })
        .when('/receive.html',
            {
                templateUrl: 'receive.html',
                controller: "GetCtrl"
            })
        .otherwise({
            templateUrl: 'history.html',
            controller: "GetCtrl"
        });
});

app.controller('GetCtrl', function ($scope, TransactionStore) {
    $scope.transactions = [];
    TransactionStore.getTransactionsInMonth(moment().format('YYYY-MM')).then(function (items) {
        $scope.transactions = items;
    });

});
app.filter('AmountFilter', function () {
        return function(items, data) {
            var newTransactions = [];
            angular.forEach(items, function (item) {
                newTransactions = item;
                if(0> item.amount) {
                    return newTransactions;
                }
            })
        }
});
app.controller('TotalCtrl', function ($scope) {
    $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.transactions.length; i++) {
            var item = $scope.transactions[i];
            total += item.amount;
        }
        return total;
    }
});

app.controller("Class", function ($scope) {
    $scope.class = 'red';
    $scope.changeClass = function () {
        if ($scope.class === "red") {
            $scope.class = "green";
        }
        else {
            $scope.class = "red";
        }
    };
    $scope.hide = function () {
        $scope.hideZero = !$scope.hideZero;
    };
    $scope.removeClass = function () {
        for (i = 0; i < $scope.transactions.length; i++) {
            var item = $scope.transactions[i];
            if (item.amount < 0) {
                $scope.class = '';
            }
        }
    };
});

app.controller('AddCtrl', function ($scope, TransactionStore) {
    $scope.transactions = {};
    $scope.adding = function () {
        var data = ({
            description: $scope.description,
            amount: $scope.amount,
            date: $scope.date
        });
        TransactionStore.add(data).then(function (data) {
            $scope.transactions = data;
        })
    };
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