$(document).ready(function(){

	/* ---------------
	Eventer function
	--------------- */
	var Eventer = function() {

	    if( !(this instanceof Eventer) ) {
	        return new Eventer();
	    }

	    cache = {};

	    this.publish = function(topic, args){
	        if(typeof cache[topic] === 'object') {    
	            cache[topic].forEach(function(property){
	                property.apply(this, args || []);
	            });
	        }
	    };

	    this.subscribe = function(topic, callback){
	        if(!cache[topic]){
	            cache[topic] = [];
	        }
	        cache[topic].push(callback);
	        return [topic, callback]; 
	    };

	    this.unsubscribe = function(topic, fn){
	        if( cache[topic] ) {
	            cache[topic].forEach(function(element, idx){
	                if(element == fn){
	                    cache[topic].splice(idx, 1);
	                }
	            });
	        }
	    };

	    this.queue = function() {
	        return cache;
	    };

	    // alias
	    this.on      = this.subscribe;
	    this.off     = this.unsubscribe;
	    this.trigger = this.publish;

	  return this;
	};

	var eventer = new Eventer;


	/* ---------------
	Initialize
	--------------- */
	d3.select("#container1").style("opacity", 0.0);
	d3.select("#container2").style("opacity", 0.0);
	d3.select("#container3").style("opacity", 0.0);


	/* ---------------
	Viewport
	--------------- */
	var bWidth = 1200, bHeight = 500;
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	    width  = bWidth  - margin.left - margin.right,
	    height = bHeight - margin.top - margin.bottom;

	var svgContainer = d3.select("#svgContainer").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("viewBox", "0 0 1200 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var Graph = function() {

	    var self = this;
	    this.e = new Eventer;


	    this.init = function() {
	        this.e.subscribe( 'load', this.getData );
	        this.e.subscribe( 'container:disappear', this.disappearContainer );
	        this.e.subscribe( 'container:appear', this.appearContainer );

	        this.e.publish( 'load' );
	    };


		/* ---------------
		navigation
		--------------- */
		//var menuNum = 4;
	    var currentNum = 0, prevNum = -1;

		var menuItems = d3.select("#radioBlock").append('form').selectAll("span")
		    .data( ["全体", "年齢", "区域", "性別"] )
		    .enter().append("span").attr("class", "navColumn");

		menuItems.append("input")
		    .attr({
		        type: "radio",
		        class: "nav",
		        name: "nav",
		        value: function(d, i) {return i;}
		    })
			.attr('id', function(d, i) {
				return "id" + i;
			})
			.attr('value', function(d, i) {
				return d;
			})
		    .property("checked", function(d, i) { 
			    if (i === prevNum) { return true; } else { return false; };
		    })
			.on("change", function(d,i){
				prevNum = currentNum;
		      	currentNum = i;
		      	self.e.publish('container:disappear');
		});

		menuItems.append("label")
			.attr('for', function(d, i) {
				return "id" + i;
			})
		    .attr({
		        class: "btn"
		    })
			.text(function(d,i) {
				console.log(d);
				return d;
			});


		this.disappearContainer = function() {

			console.log("prevNum", prevNum);
			console.log("currentNum", currentNum);

			d3.select("#container" + prevNum).style("opacity", 0.0);

		    self.e.publish('container:appear');
		}


		this.appearContainer = function() {

			d3.select("#container" + currentNum).style("opacity", 1.0);
		}


		this.init.apply( this, arguments );
	};

	new Graph;

});


/* ---------------
utility: window resize
--------------- */
var _chart = $("#chartArea"),
    aspect = _chart.width() / _chart.height(),
    container = _chart.parent();
$(window).on("resize", function() {
    console.log("resized");
    var targetWidth = container.width();
    width = targetWidth;
    height = Math.round(targetWidth / aspect);
    _chart.attr("width", width);
    _chart.attr("height", height);

}).trigger("resize");