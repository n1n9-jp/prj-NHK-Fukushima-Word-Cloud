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
	// d3.select("#container1").style("opacity", 0.0);
	// d3.select("#container2").style("opacity", 0.0);
	// d3.select("#container3").style("opacity", 0.0);

	var vis = new Array(); var vid = 0;
    var fontSizeScale = d3.scale['sqrt']().range([14, 180]);
    var layout1, layout2, layout3;

	/* ---------------
	Viewport
	--------------- */
	var bWidth = 1200, bHeight = 500;
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	    width  = bWidth  - margin.left - margin.right,
	    height = bHeight - margin.top - margin.bottom;

	// var svgContainer = d3.select("#svgContainer").append("svg")
	//     .attr("width", width + margin.left + margin.right)
	//     .attr("height", height + margin.top + margin.bottom)
	//     .attr("viewBox", "0 0 1200 500")
	//     .attr("preserveAspectRatio", "xMidYMid")
	//     .attr("id", "chartArea")
	//   .append("g")
	//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");





var widthArray = new Array();
widthArray[0] = 1200;
widthArray[1] = 400;
widthArray[2] = 400;
widthArray[3] = 400;
widthArray[4] = 400;
widthArray[5] = 400;
widthArray[6] = 400;
widthArray[7] = 600;
widthArray[8] = 600;


	/* all */
	vis[0] = d3.select("#svgcontainer0").append("svg")
	    .attr("width", widthArray[0])
	    .attr("height", height)
	    .attr("viewBox", "0 0 1200 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea0")
	  .append("g")
	    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");





	/* age */
	vis[1] = d3.select("#svgcontainer1").append("svg")
	    .attr("width", widthArray[1])
	    .attr("height", height)
	    // .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea1")
	  .append("g")
	     .attr("transform", "translate(" + widthArray[1]/2 + "," + height/2 + ")");

	vis[2] = d3.select("#svgcontainer2").append("svg")
	    .attr("width", widthArray[2])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[2] + "," + height/2 + ")")
	    // .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea2")
	  .append("g")
	     .attr("transform", "translate(" + widthArray[2]/2 + "," + height/2 + ")");

	vis[3] = d3.select("#svgcontainer3").append("svg")
	    .attr("width", widthArray[3])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[3]*2 + "," + height/2 + ")")
	    // .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea3")
	  .append("g")
	     .attr("transform", "translate(" + widthArray[3]/2 + "," + height/2 + ")");






	/* area */
	vis[4] = d3.select("#svgcontainer4").append("svg")
	    .attr("width", widthArray[4])
	    .attr("height", height)
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea4")
	  .append("g")
	    .attr("transform", "translate(" + widthArray[4]/2 + "," + height/2 + ")");

	vis[5] = d3.select("#svgcontainer5").append("svg")
	    .attr("width", widthArray[5])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[5] + "," + height/2 + ")")
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea5")
	  .append("g")
	    .attr("transform", "translate(" + widthArray[5]/2 + "," + height/2 + ")");

	vis[6] = d3.select("#svgcontainer6").append("svg")
	    .attr("width", widthArray[6])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[6]*2 + "," + height/2 + ")")
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea6")
	  .append("g")
	    .attr("transform", "translate(" + widthArray[6]/2 + "," + height/2 + ")");




	/* gender */
	vis[7] = d3.select("#svgcontainer7").append("svg")
	    .attr("width", widthArray[7])
	    .attr("height", height)
	    .attr("viewBox", "0 0 600 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea7")
	  .append("g")
	    .attr("transform", "translate(" + widthArray[7]/2 + "," + height/2 + ")");

	vis[8] = d3.select("#svgcontainer8").append("svg")
	    .attr("width", widthArray[8])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[8] + "," + height/2 + ")")
	    .attr("viewBox", "0 0 600 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea8")
	  .append("g")
	    .attr("transform", "translate(" + widthArray[8]/2 + "," + height/2 + ")");







	var Graph = function() {

	    var self = this;
	    this.e = new Eventer;

    	var tags = new Array();

	    var grayScale = d3.scale.linear()
	      .domain([1, 80])
	      .range(["#BBB", "#FFF"]);

	    this.init = function() {
	        this.e.subscribe( 'load', this.getData );
	        this.e.subscribe( 'draw:viewport', this.drawViewport );
        	this.e.subscribe( 'draw:update', this.drawUpdate );
	        this.e.subscribe( 'container:disappear', this.disappearContainer );
	        this.e.subscribe( 'container:appear', this.appearContainer );

	        this.e.publish( 'load' );
	    };


		this.getData = function() {

		    queue()
		        .defer(d3.tsv, "assets/data/all.tsv")
		        .defer(d3.tsv, "assets/data/age203040.tsv")
		        .defer(d3.tsv, "assets/data/age5060.tsv")
		        .defer(d3.tsv, "assets/data/age70.tsv")
		        .defer(d3.tsv, "assets/data/area12.tsv")
		        .defer(d3.tsv, "assets/data/area3.tsv")
		        .defer(d3.tsv, "assets/data/area4.tsv")
		        .defer(d3.tsv, "assets/data/genderMale.tsv")
		        .defer(d3.tsv, "assets/data/genderFemale.tsv")
		        .await(loadReady);


		    function loadReady(_error, _all, _age203040, 
		    					_age5060, _age70, _area12, _area3, _area4, 
		    					_genderMale, _genderFemale)
		    {
		    	tags[0] = $.extend(true, [], _all);
		    	tags[1] = $.extend(true, [], _age203040);
		    	tags[2] = $.extend(true, [], _age5060);
		    	tags[3] = $.extend(true, [], _age70);
		    	tags[4] = $.extend(true, [], _area12);
		    	tags[5] = $.extend(true, [], _area3);
		    	tags[6] = $.extend(true, [], _area4);    	
		    	tags[7] = $.extend(true, [], _genderMale);
		    	tags[8] = $.extend(true, [], _genderFemale);

            	self.e.publish('draw:viewport');
		    }

		}


	    this.drawViewport = function() {

	    	console.log("drawViewport");

	        layout1 = d3.layout.cloud()
	                .timeInterval(Infinity)
	                .size([width, height])
	                .fontSize(function(d) {
	                    return fontSizeScale(+d.value);
	                })
	                .text(function(d) {
	                	//console.log("key", d.key);
	                    return d.key;
	                })
	                .on("end", draw);
	        layout1.font('YuGothic').spiral('archimedean');


	        layout2 = d3.layout.cloud()
	                .timeInterval(Infinity)
	                .size([width/2, height])
	                .fontSize(function(d) {
	                    return fontSizeScale(+d.value);
	                })
	                .text(function(d) {
	                	//console.log("key", d.key);
	                    return d.key;
	                })
	                .on("end", draw);
	        layout2.font('YuGothic').spiral('archimedean');


	        layout3 = d3.layout.cloud()
	                .timeInterval(Infinity)
	                .size([width/3, height])
	                .fontSize(function(d) {
	                    return fontSizeScale(+d.value);
	                })
	                .text(function(d) {
	                	//console.log("key", d.key);
	                    return d.key;
	                })
	                .on("end", draw);
	        layout3.font('YuGothic').spiral('archimedean');



	        fontSizeScale.domain([10, 255])

	        self.e.publish('draw:update');

	    };


	    this.drawUpdate = function() {
	    	console.log("drawUpdate"); // x9

	    	if (vid == 0) {
	        	layout1.stop().words( tags[vid] ).start();
	    	} else if ((vid == 7) || (vid == 8)) {
	        	layout2.stop().words( tags[vid] ).start();
	    	} else {
	        	layout3.stop().words( tags[vid] ).start();	
	    	}

	    };



	    function draw(data, bounds) {

	    	console.log("bounds", bounds);
	    	var _width = widthArray[vid];


	    	console.log("vid", vid);
	    	console.log("_width", _width);


	        vis[vid].attr("width", _width).attr("height", height);

	        _scale = bounds ? Math.min(
	                _width / Math.abs(bounds[1].x - _width / 2),
	                _width / Math.abs(bounds[0].x - _width / 2),
	                height / Math.abs(bounds[1].y - height / 2),
	                height / Math.abs(bounds[0].y - height / 2)) / 2 : 1;

	        var text = vis[vid].selectAll("text")
	                .data(data, function(d) {
	                    return d.text.toLowerCase();
	                });
	                
	        text.transition()
	                .duration(1000)
	                .attr("transform", function(d) {
	                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	                })
	                .style("font-size", function(d) {
	                    return d.size + "px";
	                });;

	        text.enter().append("text")
	                .attr("text-anchor", "middle")
	                .attr("transform", function(d) {
	                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	                })
	                .style("font-size", function(d) {
	                    return d.size + "px";
	                })
	                //.style("opacity", 1e-6)
	                .transition()
	                .duration(1000);


	        text.style("font-family", function(d) {
	                    return d.font;
	                })
	                .style("fill", function(d,i) {
	                    return grayScale( +d.value );
	                })
	                .style("opacity", 1.0)
	                .text(function(d) {
	                    return d.text;
	                })
	                .on("mouseover", function (d, i){
	                    //console.log("mouseover");
	                })
	                .on("mouseout", function (d, opacity){
	                    //console.log("mouseout");
	                })
	                .on("click", function (d, i){
	                    //makeModalDialog();
	                });


	        vid++;
	        if (vid<9) {
	            self.e.publish('draw:update');
	        }
	    }



		/* ---------------
		navigation
		--------------- */
		//var menuNum = 4;
	    var currentNum = 0, prevNum = 0;

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

			// $("#container" + prevNum).fadeOut('slow', function() {
			// });
			$("#container" + prevNum).animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'} );
			self.e.publish('container:appear');
		    
		}


		this.appearContainer = function() {

			console.log("here.");
			$("#container" + currentNum).animate( { opacity: 'show'}, { duration: 1000, easing: 'swing'} );
			//d3.select("#container" + currentNum).style("opacity", 1.0);
		}


		this.init.apply( this, arguments );
	};

	new Graph;

});


/* ---------------
utility: window resize
--------------- */
var _chart0 = $("#chartArea0");
var _chart1 = $("#chartArea1");
var _chart2 = $("#chartArea2");
var _chart3 = $("#chartArea3");
var _chart4 = $("#chartArea4");
var _chart5 = $("#chartArea5");
var _chart6 = $("#chartArea6");
var _chart7 = $("#chartArea7");
var _chart8 = $("#chartArea8");

var _chart = $("#chartArea"),
    aspect = _chart.width() / _chart.height(),
    container = _chart.parent();

$(window).on("resize", function() {
    console.log("resized");
    var targetWidth = container.width();
    var _w = targetWidth;
    var _h = Math.round(targetWidth / aspect);

    _chart.attr("width", _w); _chart.attr("height", _h);
    // _chart0.attr("width", _w); _chart0.attr("height", _h);
    // _chart1.attr("width", _w); _chart1.attr("height", _h);
    // _chart2.attr("width", _w); _chart2.attr("height", _h);
    // _chart3.attr("width", _w); _chart3.attr("height", _h);
    // _chart4.attr("width", _w); _chart4.attr("height", _h);
    // _chart5.attr("width", _w); _chart5.attr("height", _h);
    // _chart6.attr("width", _w); _chart6.attr("height", _h);
    // _chart7.attr("width", _w); _chart7.attr("height", _h);
    // _chart8.attr("width", _w); _chart8.attr("height", _h);


}).trigger("resize");