module Foodstrap {
    "use strict";
    angular
        .module("app", [
            "ngRoute",
            "ngTouch",
            "ngAnimate",
            "debounce",
            "imagesLoaded"
        ])
        //контроллеры
        .controller("AppController", AppController)
        .controller("FoodController", FoodController)
        .controller("CookController", CookController)
        .controller("CompleteController", CompleteController)

        //configuation
        .config([
            "$routeProvider", ($routeProvider: ng.route.IRouteProvider) => {
                //configure route
                $routeProvider
                    .when("/Start", {
                        templateUrl: "/assets/templates/foodControllerTemplate.html",
                        controller: "FoodController"
                    })
                    .when("/Cook", {
                        templateUrl: "/assets/templates/cookControllerTemplate.html",
                        controller: "CookController",
                        reloadOnSearch: false
                    })
                    .when("/Complete", {
                        templateUrl: "/assets/templates/completeControllerTemplate.html",
                        controller: "CompleteController"
                    })
                    .otherwise("/Start");
            }
        ]);

}