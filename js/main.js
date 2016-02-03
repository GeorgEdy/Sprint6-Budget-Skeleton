$(document).ready(function() {
 $('.input-group.date').datetimepicker({
 format: 'YYYY-MM-DD HH:mm'
 });
 });
angular.module('myApp', ['ngRoute'])

    .config(function ($routeProvider) {
        $routeProvider.when("/",
            {
                templateUrl: "history.html"
            })
            .when('/spend.html',
                {
                    templateUrl: 'spend.html'
                })
            .when('/receive.html',
                {
                    templateUrl: 'receive.html'
                })
    });