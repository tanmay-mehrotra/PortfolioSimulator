(function(){
    'use strict';
    angular.module('portfolioSim', ['ui.bootstrap','googlechart'])
    	.controller('portfolioSimCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    		//parameters needed to run the simulation
		    $scope.start_date = null;
	        $scope.end_date = null;
	        $scope.investment_type = null;
	        $scope.sectors = sectors;
	        $scope.products = products;
	        $scope.selectedProducts = [];
	        $scope.selectedSectors = [];
	        $scope.slider_changed = 0;
	        $scope.amount = 0;

	        //list listerns to update parent controller if there is some change in child controllers
	        $scope.$on("update_parent_controller_start_date", function(event, start_date) {
        		$scope.start_date = start_date;
      		});

      		$scope.$on("update_parent_controller_end_date", function(event, end_date) {
        		$scope.end_date = end_date;
      		});

    	   	$scope.change_slider = function(){
    	   		if($scope.investment_type == "product_wise"){
    	   			for(var i = 0;i< $scope.selectedProducts.length;i++){
    	   				console.log( $scope.selectedProducts[i].key + " " + $scope.selectedProducts[i].value);
    	   			}
    	   		}else{
    	   			for(var i = 0;i< $scope.selectedSectors.length;i++){
    	   				console.log($scope.selectedSectors[i].key + " " + $scope.selectedSectors[i].value);
    	   			}
    	   		}
    	   		$scope.slider_changed += 1;
    	   		console.log($scope.slider_changed);
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
		.controller('PieChartCtrl', function($scope){
			var chartData = [['Component', 'cost']];

			//call when checkbox state is changed --> reset pie chart
			var new_selection = function(oldval, newval){
				if(oldval === newval){
					return;
				}
			 	//clear chartData -- > we cannot unnecessarily create new objects eveytime
			 	console.log("new_selection");
    	   		while(chartData.length > 1) {
    				chartData.pop();
				}   	   		
    	   	
			    if($scope.investment_type == 'product_wise'){
			    	for(var i=0;i< $scope.selectedProducts.length;i++){
			    		console.log($scope.selectedProducts[i].key + " " + 100/$scope.selectedProducts.length);
			    		$scope.selectedProducts[i].value = 100/$scope.selectedProducts.length;
			    		chartData.push([$scope.selectedProducts[i].key, $scope.selectedProducts[i].value]);
			    	}
			    }

			    if($scope.investment_type == 'sector_wise'){
			    	for(var i=0;i< $scope.selectedSectors.length;i++){
			    		console.log($scope.selectedSectors[i].key + " " + 100/$scope.selectedSectors.length);
			    		$scope.selectedSectors[i].value = 100/$scope.selectedSectors.length;
			    		chartData.push([$scope.selectedSectors[i].key, $scope.selectedSectors[i].value]);
			    	}
			    }
			    render_chart();
			};

			var investment_type_changes = function(oldval,newval){
				if(oldval === newval){
					return;
				}
				console.log("investment_type_changes" + $scope.investment_type);
				while(chartData.length > 1) {
    				chartData.pop();
				}   	   		
    	   	
			    if($scope.investment_type == 'product_wise'){
			    	for(var i=0;i< $scope.selectedProducts.length;i++){
			    		chartData.push([$scope.selectedProducts[i].key, Number($scope.selectedProducts[i].value)]);
			    	}
			    }

			    if($scope.investment_type == 'sector_wise'){
			    	for(var i=0;i< $scope.selectedSectors.length;i++){
			    		chartData.push([$scope.selectedSectors[i].key, Number($scope.selectedSectors[i].value)]);
			    	}
			    }
			    render_chart();
			};

			var slider_changes = function(oldval, newval){
				investment_type_changes(oldval,newval);
			};

		    var render_chart =  function(){
	        	$scope.chart = {
	        		type : "PieChart",
	        		data : chartData,
	        		options :{
	        			displayExactValues: true,
				        width: 350,
				        height: 150,
				        is3D: true,
				        chartArea: {left:25,top:10,bottom:0,right:0,height:"100%"}
	        		},
	        		formatters : {
	        			number : [{
					        columnNum: 1,
					        pattern: "$ #,##0.00"
	      				}]
	        		}
	        	};
        	}
	    	//watches to trigger re-rendering of chart on change of user input
		    $scope.$watch(function(scope){return (scope.selectedProducts.length + scope.selectedSectors.length)}, 
		    	                          new_selection);
		    $scope.$watch(function(scope){return scope.investment_type},investment_type_changes);
		    $scope.$watch(function(scope){return scope.slider_changed},slider_changes);
		});
            	
	
	var products = [
	                 	{key:'HERO',value:0}, {key:'MARUTI',value:0}, {key:'TATA',value:0},
	 				    {key:'ICICI',value:0}, {key:'IDBI',value:0}, {key:'SBI',value:0}, 
	 				    {key:'BRITANNIA',value:0}, {key:'DABUR',value:0}
	 			   ];

	var sectors = [
	                   {key:'Automobile',value:0}, {key:'Banking',value:0}, {key:'FMCG',value:0}, 
	                   {key:'IT',value:0}, {key:'Power',value:0}
	              ];

}());