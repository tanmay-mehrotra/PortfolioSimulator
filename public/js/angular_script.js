(function(){
    'use strict';
    angular.module('portfolioSim', ['ui.bootstrap','googlechart'])
    	.controller('portfolioSimCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    		//parameters needed to run the simulation
		    $scope.start_date = null;
	        $scope.end_date = null;
	        $scope.investment_type = null;
	        $scope.sectors = [];
	        $scope.products = [];
	        $scope.product_checkBox_counter = 0;
	        $scope.sector_checkBox_counter = 0;
	        $scope.slider_changed = 0;
	        $scope.amount = 0;

	        
	        //populate product and sectors array creating 2D array
	        //step indicate number of columns
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

    	   	$scope.count_product_checkbox = function(product){
    	   		//console.log(product.key + product.check);
    	   		if(product.check == 0){
    	   			$scope.product_checkBox_counter -= 1;
    	   		}else{
    	   			$scope.product_checkBox_counter += 1;
    	   		}
    	   	};

    	   	$scope.count_sector_checkbox = function(sector){
    	   		//console.log(product.key + product.check);
    	   		if(sector.check == 0){
    	   			$scope.sector_checkBox_counter -= 1;
    	   		}else{
    	   			$scope.sector_checkBox_counter += 1;
    	   		}
    	   	};

    	   	$scope.change_slider = function(){
    	   		console.log("slider changed");
    	   		if($scope.investment_type == "product_wise"){
    	   			for(var i = 0;i<products.length;i++){
    	   				console.log(products[i].key + " " + products[i].value + " " + typeof products[i].value+ " "+ products[i].check);
    	   			}
    	   		}else{
    	   			for(var i = 0;i<sectors.length;i++){
    	   				console.log(sectors[i].key + " " + sectors[i].value + " " + sectors[i].check);
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
			var checkbox_count_changes = function(oldval, newval){
				if(oldval === newval){
					return;
				}
			 	//clear chartData -- > we cannot unnecessarily create new objects eveytime
			 	console.log("checkbox_count_changes kicks in");
    	   		while(chartData.length > 1) {
    				chartData.pop();
				}   	   		
    	   	
			    if($scope.investment_type == 'product_wise'){
			    	for(var i=0;i<products.length;i++){
			    		if(products[i].check == 1){
			    			products[i].value = 100/$scope.product_checkBox_counter;
			    		}else{
			    			products[i].value = 0;
			    		}
			    		chartData.push([products[i].key,products[i].value]);
			    	}
			    	for(var i = 0;i<products.length;i++){
    	   				console.log(products[i].key + " " + products[i].value + " " + typeof products[i].value + " " + products[i].check);
    	   			}
			    }

			    if($scope.investment_type == 'sector_wise'){
			    	for(var i=0;i<sectors.length;i++){
			    		if(sectors[i].check == 1){
			    			sectors[i].value = 100/$scope.sector_checkBox_counter;
			    		}else{
			    			sectors[i].value = 0;
			    		}
			    		chartData.push([sectors[i].key,sectors[i].value]);
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
			    	for(var i=0;i<products.length;i++){
			    		chartData.push([products[i].key,Number(products[i].value)]);
			    	}
			    }

			    if($scope.investment_type == 'sector_wise'){
			    	for(var i=0;i<sectors.length;i++){
			    		chartData.push([sectors[i].key,Number(sectors[i].value)]);
			    	}
			    }
			    console.log("re rendering chart");
			    render_chart();
			}

			var slider_changes = function(oldval, newval){
				investment_type_changes(oldval,newval);
			};

		    var render_chart =  function(){
	        	$scope.chart = {
	        		type : "PieChart",
	        		data : chartData,
	        		options :{
	        			displayExactValues: true,
				        width: 300,
				        height: 150,
				        is3D: true,
				        chartArea: {left:75,top:10,bottom:0,right:0,height:"100%"}
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
		    $scope.$watch(function(scope){return (scope.product_checkBox_counter + scope.sector_checkBox_counter)}, 
		    	                          checkbox_count_changes);
		    $scope.$watch(function(scope){return scope.investment_type},investment_type_changes);
		    $scope.$watch(function(scope){return scope.slider_changed},slider_changes);
		});
            	
	
	var products = [
	                 	{key:'HERO',value:0, check:0}, {key:'MARUTI',value:0,check:0}, {key:'TATA',value:0,check:0},
	 				    {key:'ICICI',value:0,check:0}, {key:'IDBI',value:0,check:0}, {key:'SBI',value:0,check:0}, 
	 				    {key:'BRITANNIA',value:0, check:0}, {key:'DABUR',value:0, check:0}
	 			   ];

	var sectors = [
	                   {key:'Automobile',value:0,check:0}, {key:'Banking',value:0,check:0}, {key:'FMCG',value:0,check:0}, 
	                   {key:'IT',value:0,check:0},{key:'Power',value:0,check:0}
	              ]; 			   

}());