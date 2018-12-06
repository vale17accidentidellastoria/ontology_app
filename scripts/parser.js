var main_app = angular.module('app', []);

main_app.controller('MainCtrl', function ($scope, $http) {
    $scope.dataTypeProperty = [];
    $scope.objectProperty = [];
    $scope.rdf_class = [];
    $scope.rdf_firstclass = [];
    $scope.rdf_secondclass = [];
    $scope.namedIndividual = [];
    $scope.showContent = function($fileContent){
        $scope.content = $fileContent;
        $scope.objectProperty = $fileContent;
    };

    $scope.nextPage = function() {
        console.log("processOntology ok");
        window.location = "output_ontology.html";
    };

    $scope.processOntology = function() {
        $http.post('http://localhost:3030/process')
        .then(function(response) {
            $scope.dataTypeProperty = response.data[0];
            $scope.objectProperty = response.data[1];
            $scope.rdf_class = response.data[2];
            $scope.namedIndividual = response.data[3];
            $scope.rdf_firstclass = response.data[4];
            $scope.rdf_secondclass = response.data[5];
        });

    }
});

/*
//Service for managing resulting intents
main_app.service('sharedIntentsOutput', function () {
    //var intents = ['intent one', 'intent two', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q'];
    var intents = ['intent one', 'intent two'];
    return {
        getIntents: function() {
            return intents;
        },
        addIntent: function(value) {
            intents.push(value);
        }
    }
});

//Service for managing resulting entities
main_app.service('sharedEntitiesOutput', function () {
    var entities = ['entity one', 'entity two'];

    return {
        getEntities: function() {
            return entities;
        },
        addEntity: function(value) {
            entities.push(value);
        }
    }
});

//Controller to print resulting intents using 'sharedIntentsOutput' service
main_app.controller('outputIntentsCtrl', ['$scope', 'sharedIntentsOutput', 
    function($scope, sharedIntentsOutput) {
        console.log(sharedIntentsOutput.getIntents());
        sharedIntentsOutput.addIntent('intent three');
        $scope.intents_list = sharedIntentsOutput.getIntents();
        console.log(sharedIntentsOutput.getIntents());
        console.log("Printing Intent List...");
        console.log($scope.intents_list);
        console.log("End");
}]);

//Controller to print resulting intents using 'sharedEntitiesOutput' service
main_app.controller('outputEntitiesCtrl', ['$scope', 'sharedEntitiesOutput', 
    function($scope, sharedEntitiesOutput) {
        console.log(sharedEntitiesOutput.getEntities());
        sharedEntitiesOutput.addEntity('entity three');
        $scope.entities_list = sharedEntitiesOutput.getEntities();
        console.log(sharedEntitiesOutput.getEntities());
        console.log("Printing Entity List...");
        console.log($scope.entities_list);
        console.log("End");
}]);
*/

//A simple controller that just prints welcome
/*
main_app.controller('welcomeCtrl', ['$scope',
  function($scope) {
    $scope.welcome = { text: 'Welcome to our Ontology App!' };
}]);
*/

//Directive which is called when inside the <input> tag we write: on-read-file="showContent($fileContent)"
/*
main_app.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
*/