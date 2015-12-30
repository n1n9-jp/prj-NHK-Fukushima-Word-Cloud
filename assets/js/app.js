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
    var selectedWord="";
    var detailWords;

	/* ---------------
	Viewport
	--------------- */
	var bWidth = 1200, bHeight = 500;
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
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


	var transWidth = new Array();
	transWidth[0] = width/2;
	transWidth[1] = widthArray[1]/2;
	transWidth[2] = widthArray[2]/2;
	transWidth[3] = widthArray[3]/2;
	transWidth[4] = widthArray[4]/2;
	transWidth[5] = widthArray[5]/2;
	transWidth[6] = widthArray[6]/2;
	transWidth[7] = widthArray[7]/2;
	transWidth[8] = widthArray[8]/2;


	var transHeight = new Array();
	transHeight[0] = height/2;
	transHeight[1] = height/2;
	transHeight[2] = height/2;
	transHeight[3] = height/2;
	transHeight[4] = height/2;
	transHeight[5] = height/2;
	transHeight[6] = height/2;
	transHeight[7] = height/2;
	transHeight[8] = height/2;



	/* all */
	vis[0] = d3.select("#svgcontainer0").append("svg")
	    .attr("width", widthArray[0])
	    .attr("height", height)
	    .attr("viewBox", "0 0 1200 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea0")
	  .append("g")
	    .attr("transform", "translate(" + transWidth[0] + "," + transHeight[0] + ")");




	/* age */
	vis[1] = d3.select("#svgcontainer1").append("svg")
	    .attr("width", widthArray[1])
	    .attr("height", height)
	    // .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea1")
	  .append("g")
	     .attr("transform", "translate(" + transWidth[1] + "," + transHeight[1] + ")");

	vis[2] = d3.select("#svgcontainer2").append("svg")
	    .attr("width", widthArray[2])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[2] + "," + height/2 + ")")
	    // .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea2")
	  .append("g")
	     .attr("transform", "translate(" + transWidth[2] + "," + transHeight[2] + ")");

	vis[3] = d3.select("#svgcontainer3").append("svg")
	    .attr("width", widthArray[3])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[3]*2 + "," + height/2 + ")")
	    // .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea3")
	  .append("g")
	     .attr("transform", "translate(" + transWidth[3] + "," + transHeight[3] + ")");



	/* area */
	vis[4] = d3.select("#svgcontainer4").append("svg")
	    .attr("width", widthArray[4])
	    .attr("height", height)
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea4")
	  .append("g")
	    .attr("transform", "translate(" + transWidth[4] + "," +transHeight[4] + ")");

	vis[5] = d3.select("#svgcontainer5").append("svg")
	    .attr("width", widthArray[5])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[5] + "," + height/2 + ")")
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea5")
	  .append("g")
	    .attr("transform", "translate(" + transWidth[5] + "," + transHeight[5] + ")");

	vis[6] = d3.select("#svgcontainer6").append("svg")
	    .attr("width", widthArray[6])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[6]*2 + "," + height/2 + ")")
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea6")
	  .append("g")
	    .attr("transform", "translate(" + transWidth[6] + "," + transHeight[6] + ")");



	/* gender */
	vis[7] = d3.select("#svgcontainer7").append("svg")
	    .attr("width", widthArray[7])
	    .attr("height", height)
	    .attr("viewBox", "0 0 600 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea7")
	  .append("g")
	    .attr("transform", "translate(" + transWidth[7] + "," + transHeight[7] + ")");

	vis[8] = d3.select("#svgcontainer8").append("svg")
	    .attr("width", widthArray[8])
	    .attr("height", height)
	    .attr("transform", "translate(" + widthArray[8] + "," + height/2 + ")")
	    .attr("viewBox", "0 0 600 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea8")
	  .append("g")
	    .attr("transform", "translate(" + transWidth[8] + "," + transHeight[8] + ")");






	var Graph = function() {

	    var self = this;
	    this.e = new Eventer;

    	var tags = new Array();

    	var aboutFlg = "close";

    	// var tempWholeX = 0;
    	// var tempWholeY = 0;

    	// var tempWholeX = width/2;
    	// var tempWholeY = height/2;


	    var grayScale = d3.scale.linear()
	      .domain([1, 80])
	      .range(["#BBB", "#FFF"]);

	    this.init = function() {
	        this.e.subscribe( 'load', this.getData );
	        this.e.subscribe( 'draw:viewport', this.drawViewport );
	        this.e.subscribe( 'draw:about', this.aboutLink );
        	this.e.subscribe( 'draw:update', this.drawUpdate );
	        this.e.subscribe( 'container:disappear', this.disappearContainer );
	        this.e.subscribe( 'container:appear', this.appearContainer );
        	this.e.subscribe( 'show:detail', this.showDetail );

	        this.e.publish( 'load' );
	    };


	    this.aboutLink = function() {


		    $("#abouLinkTextOpen").click(function(){
		                                    
		        if(aboutFlg == "close"){
		        		console.log("close");

						$("#description").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );
						$("#container" + currentNum).animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );

						$("#abouLinkText").text("☓ 閉じる");
						aboutFlg = "open";
		        };

		    });


		    $("#abouLinkTextClose").click(function(){
		                                    
		        if(aboutFlg == "open"){
						$("#description").animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
						$("#container" + currentNum).animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );

						$("#abouLinkText").text("このサイトについて");
						aboutFlg = "close";
		        };

		    });


	    }





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
		        .defer(d3.tsv, "assets/data/detail.tsv")
		        .await(loadReady);


		    function loadReady(_error, _all, _age203040, 
		    					_age5060, _age70, _area12, _area3, _area4, 
		    					_genderMale, _genderFemale, _detail)
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

		    	detailWords = $.extend(true, [], _detail);
		    	console.log(detailWords);

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
	    	//console.log("drawUpdate"); // x9

	    	if (vid == 0) {
	        	layout1.stop().words( tags[vid] ).start();
	    	} else if ((vid == 7) || (vid == 8)) {
	        	layout2.stop().words( tags[vid] ).start();
	    	} else {
	        	layout3.stop().words( tags[vid] ).start();	
	    	}

	    };



	    function draw(data, bounds) {

	    	//console.log("bounds", bounds);
	    	var _width = widthArray[vid];


	    	//console.log("vid", vid);
	    	//console.log("_width", _width);


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
	                });

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
	                .attr("id", function(d,i){
	                	return d.text + i;
	                })
	                .text(function(d) {
	                    return d.text;
	                })
	                .on("mouseover", function (d, i){
					    d3.select("#"+ d.text + i).transition().duration(40).style({fill:'#000000'}).style("cursor", "pointer");
	                })
	                .on("mouseout", function (d, i){
					    d3.select("#"+ d.text + i).transition().duration(400).style("fill", function(d){
							return grayScale( +d.value );
	                	})
	            	})
	                .on("click", function (d, i){

					    d3.select("#"+ d.text + i).transition().duration(0).style("fill", function(d){
							return grayScale( +d.value );
	                	})

	                	selectedWord = d.text;

	                	var _r = d.rotate * -1;
	                	var _tx = transWidth[0] - d3.transform(d3.select(this).attr("transform")).translate[0];
	                	var _ty = transHeight[0] - d3.transform(d3.select(this).attr("transform")).translate[1]-100;	                	


	                	d3.select(this.parentNode).transition().duration(1000).delay(1000).attr("transform", function(d) {
	                    	return "translate(" + _tx + "," + _ty + ")";
	                	});



	                	d3.select(this.parentNode).selectAll("text").transition().duration(500).style("fill-opacity", .0);
	                	d3.select(this).transition().duration(50).style("fill-opacity", 1.0);


	                    self.e.publish('show:detail');
	                });

	        vid++;
	        if (vid<9) {
	            self.e.publish('draw:update');
	            self.e.publish('draw:about');
	        }
	    }





	    this.showDetail = function() {
	    	console.log("selectedWord", selectedWord);

	    	for (var i=0; i<detailWords.length; i++) {
	    		if (detailWords[i]["keyword"] == selectedWord) {
	    			console.log(detailWords[i]["keyword"], detailWords[i]["expression"]);

	    			var _age 		= detailWords[i]["age"];
	    			var _sex 		= detailWords[i]["sex"];
	    			var _area 		= parseInt( detailWords[i]["area"] );
	    			var _keyword	= detailWords[i]["keyword"];	
	    			var _expression = detailWords[i]["expression"];	    				    			
	    		}
	    	};

	    	var _areatext;
	    	console.log(_area);

			switch (_area) {
				case 0:
				  _areatext = "";
				  break;
				case 1:
				  _areatext = "帰還困難区域";
				  break;
				case 2:
				  _areatext = "帰還困難区域";
				  break;
				case 3:
				  _areatext = "居住制限区域";
				  break;
				case 4:
				  _areatext = "避難指示解除準備区域";
				  break;
			}

		    var options = {
		        title : '避難者の声' + '<div class="attr age">' + _sex + ' ' + _age + '歳 '+ _areatext + '</div>',
		        content : '<div class="attr area">' + _expression + '</div>',
		        buttons : [{
		            label: '閉じる'
		        }]
		    };

		    new ZMODAL(options);

	    };





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
				console.log(currentNum);
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

			$("#container" + prevNum).animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
			$("#submenu" + prevNum).animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
			self.e.publish('container:appear');
		    
		}


		this.appearContainer = function() {

			$("#container" + currentNum).animate( { opacity: 'show'}, { duration: 1000, easing: 'swing'} );
			$("#submenu" + currentNum).animate( { opacity: 'show'}, { duration: 1000, easing: 'swing'} );

		}


		this.opacityFull = function() {
			vis[currentNum].selectAll("text").transition().duration(1000).style("fill-opacity", 1.0);
		}


		this.init.apply( this, arguments );
	};

	gg = new Graph;




});

var gg;


function closeDetailBtn() {
		gg.opacityFull();
}






// $( "#aboutContainer" ).mouseenter(function() {
// 	$(this).find('img').transition({
// 	  y: '-400px'
// 	});
// });

// $( ".item" ).mouseleave(function() {
// 	$(this).find('img').transition({
// 	  perspective: '200px',
// 	  rotate3d: '0,0,0,0deg'
// 	}).stop();
// });



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