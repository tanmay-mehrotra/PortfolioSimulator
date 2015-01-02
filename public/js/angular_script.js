(function(){
    'use strict';
    angular.module('portfolioSim', ['ui.bootstrap','nvd3','checklist-model','ng-fusioncharts'])
    	.controller('portfolioSimCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    		//parameters needed to run the simulation
		    $scope.start_date = null;
	        $scope.end_date = null;
	        $scope.investment_type = null;
	        $scope.sectors = [];
	        $scope.products = [];
	        $scope.selectedCheckBoxes = [];

	        //populate product and sectors array creating 2D array
			for (var i = 0 ; i< products.length; i += 5) {
    			$scope.products.push(products.slice(i, i + 5));
			}

			for (var i = 0 ; i< sectors.length; i += 5) {
    			$scope.sectors.push(sectors.slice(i, i + 5));
			}

	        //list listerns to update parent controller if there is some change in child controllers
	        $scope.$on("update_parent_controller_start_date", function(event, start_date) {
        		$scope.start_date = start_date;
      		});

      		$scope.$on("update_parent_controller_end_date", function(event, end_date) {
        		$scope.end_date = end_date;
      		});

      		//function to flush all the selected Check boxes
    	   	$scope.clearSelectedCheckBoxes = function(){
    	   		while($scope.selectedCheckBoxes.length > 0) {
    				$scope.selectedCheckBoxes.pop();
				}   	   		
    	   	};
      		
		    //when submitting the add form, send the text to the node RestFulAPI
		    $scope.simulate = function() {
		        $http.post('/api/calculateDiff', $scope.dates)
		            .success(function(data) {
		                $scope.diff = data;
		            })
		            .error(function(data) {
		                console.log('Error: ' + data);
		            });
		    };
		}])
		.controller('datePickerCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
		    $scope.start_dt = new Date();
		    $scope.end_dt = new Date();

		    $scope.start_open = function($event) {
		        $event.preventDefault();
		        $event.stopPropagation();
		        $scope.is_start_open = true;
		    };

		    $scope.end_open = function($event) {
		        $event.preventDefault();
		        $event.stopPropagation();
		        $scope.is_end_open = true;
		    };

		    //update any date change to parent controller
		    $scope.updateDate = function(){
		  	    $scope.$emit('update_parent_controller_start_date', $scope.start_dt);
		  	    $scope.$emit('update_parent_controller_end_date', $scope.end_dt);
		    };
		    $scope.updateDate();

		    $scope.dateOptions = {
		        formatYear: 'yy',
		        startingDay: 1,
		        showWeeks:false
		    };

		    $scope.format = 'dd-MMMM-yyyy'; 
		}])
		/*.controller('PieChartCtrl', function($scope){
			$scope.$watch(function(scope){return $scope.selectedCheckBoxes.length}, 
      			function(newValue, oldValue){
					$scope.options = {
			            chart: {
			                type: 'pieChart',
			                height: 300,
			                x: function(d){return d.name;},
			                y: function(d){return d.total;},
			                showLabels: false,
			                transitionDuration: 500,
			                showLegend : false,
			                tooltips: true,
			                donut: false,
			            },
			            css: {
			              textAlign: "center",
			              "font-weight": "bold",
			            }
		        	};
		        	var data = [];
		        	for(var i = 0 ; i < $scope.selectedCheckBoxes.length; i++){
		        		data.push({name:$scope.selectedCheckBoxes[i], total:100/$scope.selectedCheckBoxes.length});
		        	}
			        $scope.data = data;
	    		}
	    	);
		});*/
		.controller('PieChartCtrl', function($scope){
			//$scope.$watch(function(scope){return $scope.selectedCheckBoxes.length}, 
      			//function(newValue, oldValue){
      				/*var data = [];
		        	for(var i = 0 ; i < $scope.selectedCheckBoxes.length; i++){
		        		data.push({label:$scope.selectedCheckBoxes[i], value:100/$scope.selectedCheckBoxes.length});
		        	}*/
					$scope.dataSource = {
			            chart: {
			                caption: "Age profile of website visitors",
			                subcaption: "Last Year",
			                startingangle: "120",
			                showlabels: "0",
			                showlegend: "1",
			                enablemultislicing: "0",
			                slicingdistance: "15",
			                showpercentvalues: "1",
			                showpercentintooltip: "0",
			                plottooltext: "Age group : $label Total visit : $datavalue",
			                theme: "ocean"
            			},
			            data: [
			                {
			                    label: "Teenage",
			                    value: "1250400"
			                },
			                {
			                    label: "Adult",
			                    value: "1463300"
			                },
			                {
			                    label: "Mid-age",
			                    value: "1050700"
			                },
			                {
			                    label: "Senior",
			                    value: "491000"
			                }
            			]
		        	};
	    		//}
	   		 //);
		});

	var sectors = ['Automobile', 'Banking', 'FMCG', 'IT', 'Power'];
	var products = ['HERO', 'MARUTI', 'TATA', 'ICICI', 'IDBI', 'SBI', 'BRITANNIA', 'DABUR', 'GILLETTE',
						'HCL', 'INFOSYS', 'TCS', 'NTPC', 'RELIANCEINFRA', 'TATAPOWER'];

}());