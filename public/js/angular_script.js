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
	        $scope.all_items = null;

	        $scope.selected_products = [];
	        $scope.selected_sectors = [];
	        $scope.selected_items = null;

	        $scope.index_of_selected_item = null;
	        
	        $scope.amount = null;
	        
	        $scope.slider_count = 0;
	        $scope.slider_old_value = 0;
	        $scope.slider_new_value = 0;

	        $scope.chart_data = [['Component', 'cost']];

	        //list listerns to update parent controller if there is some change in child controllers
	        $scope.$on("update_parent_controller_start_date", function(event, start_date) {
        		$scope.start_date = start_date;
      		});

      		$scope.$on("update_parent_controller_end_date", function(event, end_date) {
        		$scope.end_date = end_date;
      		});

      		$scope.selected_radio = function(index){
      			$scope.index_of_selected_item = index;
      			$scope.slider_old_value = $scope.selected_items[$scope.index_of_selected_item].value;
      			$scope.slider_new_value = $scope.selected_items[$scope.index_of_selected_item].value;
      		};

    	   	$scope.change_slider = function(){
    	   		//if none of the items are selected
    	   		if($scope.index_of_selected_item == null){
    	   			console.log('returning');
    	   			return;
    	   		}
    	   		$scope.slider_old_value = $scope.slider_new_value;
    	   		$scope.selected_items[$scope.index_of_selected_item].value = 
    	   		 									Number($scope.selected_items[$scope.index_of_selected_item].value);
    	   		$scope.slider_new_value = $scope.selected_items[$scope.index_of_selected_item].value; 									
    	   		$scope.slider_count += 1; 
    	   	};

    	   	var switch_arrays = function(){
    	   		if($scope.investment_type == 'sector_wise'){
    	   			$scope.selected_items = $scope.selected_sectors;
    	   			$scope.all_items = $scope.sectors;
    	   		}
    	   		if($scope.investment_type == 'product_wise'){
    	   			$scope.selected_items = $scope.selected_products;
    	   			$scope.all_items = $scope.products;
    	   		}
    	   		//if none of the items are selected and someone moves the slider then it should not break
    	   		if($scope.selected_items == null){
    	   		    $scope.index_of_selected_item = null;
    	   		}
    	   	};

    	   	$scope.emptychart_data = function(){
    	   		while($scope.chart_data.length > 1) {
    				$scope.chart_data.pop();
				}
    	   	};


    	   	$scope.$watch(function(scope){return scope.investment_type}, switch_arrays);
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
			//call when checkbox state is changed --> reset pie chart
			var reset_all = function(oldval, newval){
				if(oldval === newval){
					return;
				}
				if($scope.selected_items === null){
					return;
				}
			 	//clear chart_data -- > we cannot unnecessarily create new objects eveytime
    	   		$scope.emptychart_data();
		    	for(var i=0;i< $scope.selected_items.length;i++){
		    		$scope.selected_items[i].value = Number(($scope.amount/$scope.selected_items.length).toFixed(2));
		    		console.log('key ' + $scope.selected_items[i].key +' value ' + $scope.selected_items[i].value);
		    		$scope.chart_data.push([$scope.selected_items[i].key, $scope.selected_items[i].value]);
		    	}
			    render_chart();
			};

			var investment_type_changes = function(newval,oldval){
				if(oldval === newval){
					return;
				}
				$scope.emptychart_data();	   		
			    for(var i=0;i< $scope.selected_items.length;i++){
			    	$scope.chart_data.push([$scope.selected_items[i].key, $scope.selected_items[i].value]);
			    }
			    render_chart();
			};

			var slider_changes = function(newval,oldval){
				if(oldval === newval){
					return;
				}
				if($scope.slider_new_value === $scope.slider_old_value){
					return;
				}
				$scope.emptychart_data();  	   		
    	   		//here we need to code logic to rebalance our sliders and values
		    	var diff = $scope.slider_new_value - $scope.slider_old_value;
		    	if(diff > 0){
		    		var avg_diff = Number((diff/($scope.selected_items.length-1)).toFixed(2));
		    		for(var i=0;i< $scope.selected_items.length;i++){
		    			if(i !== $scope.index_of_selected_item){
		    				$scope.selected_items[i].value -= avg_diff;
		    			}
		    			$scope.chart_data.push([$scope.selected_items[i].key, $scope.selected_items[i].value]);	
		    		}
		    	}else{
		    	    var zero_sliders = [];
		    	    for(var i=0;i< $scope.selected_items.length;i++){
		    	    	if($scope.selected_items[i].value == 0){
		    	    		zero_sliders.push(i);
		    	    	}
		    	    }
		    	    var avg_diff = Number((diff/($scope.selected_products.length - (zero_sliders.length+1))).toFixed(2));
		    	    for(var i=0;i< $scope.selected_products.length;i++){
		    	    	if(zero_sliders.indexOf(i)==-1 && (i !== $scope.index_of_selected_item)){	
		    	    		$scope.selected_products[i].value -= avg_diff;
		    	    	}
		    	    	$scope.chart_data.push([$scope.selected_products[i].key, $scope.selected_products[i].value]);
		    	    } 
		    	}
			    render_chart();
			};

		    var render_chart =  function(){
	        	$scope.chart = {
	        		type : "PieChart",
	        		data : $scope.chart_data,
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
        	};

	    	//watch to trigger re-rendering of chart on selecting new product/sector
		    $scope.$watch(function(scope){
		    	if(scope.selected_items == null){
		    		return null;
		    	}else{
		    		return scope.selected_items.length
		    	}
		    }, reset_all);
		    //watch to trigger re-rendering on change of investment type
		    $scope.$watch(function(scope){return scope.investment_type},investment_type_changes);
		    //watch to trigger re-rendering on change of sliding input
		    $scope.$watch(function(scope){return scope.slider_count},slider_changes);
		    //watch to trigger re-rendering on change of amount
		    $scope.$watch(function(scope){return scope.amount},reset_all);
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