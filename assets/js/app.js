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


	// $("#submenu1").animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
	// $("#submenu2").animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
	// $("#submenu3").animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );


	/* ---------------
	Initialize
	--------------- */

	var currentNum = 0, prevNum = 0;


	var vis = new Array(); var vid = 1; var vidId = 0;
    var fontSizeScale = d3.scale['sqrt']().range([14, 180]);
    var layout1, layout2, layout3;
    var selectedWord="";
    var detailWords, allOpenText;
    var detailWordsArray = new Array();

	/* ---------------
	Viewport
	--------------- */
	var bWidth = 1200, bHeight = 500;
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	    width  = bWidth  - margin.left - margin.right,
	    height = bHeight - margin.top - margin.bottom;
	var aspect = bWidth / bHeight;

	nowWidth = bWidth, nowHeight = bHeight;

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

	var container = $("#svgContainerContainer");


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
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea1")
	  .append("g")
	     .attr("transform", "translate(" + transWidth[1] + "," + transHeight[1] + ")");

	vis[2] = d3.select("#svgcontainer2").append("svg")
	    .attr("width", widthArray[2])
	    .attr("height", height)
	    // .attr("transform", "translate(" + widthArray[2] + "," + height/2 + ")")
	    .attr("viewBox", "0 0 400 500")
	    .attr("preserveAspectRatio", "xMidYMid")
	    .attr("id", "chartArea2")
	  .append("g")
	     .attr("transform", "translate(" + transWidth[2] + "," + transHeight[2] + ")");

	vis[3] = d3.select("#svgcontainer3").append("svg")
	    .attr("width", widthArray[3])
	    .attr("height", height)
	    // .attr("transform", "translate(" + widthArray[3]*2 + "," + height/2 + ")")
	    .attr("viewBox", "0 0 400 500")
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


	/*  for timer */
	var boxAnim;
	var interval = 1000;



	var Graph = function() {

	    var self = this;
	    this.e = new Eventer;

    	var tags = new Array();

    	var aboutFlg = "close";
    	var firstFlg = false;
    	//var mouseoverFlg = false;
    	var selectObj;


	    var grayScale = d3.scale.linear()
	      .domain([1, 80])
	      .range(["#DDD", "#FFF"]);

	    this.init = function() {
	        this.e.subscribe( 'load', this.getData );
	        this.e.subscribe( 'init:viewport', this.initViewport );
        	this.e.subscribe( 'draw:controll', this.drawControll );
        	this.e.subscribe( 'draw:whole', this.drawWhole );
	        this.e.subscribe( 'container:disappear', this.disappearContainer );
	        this.e.subscribe( 'container:appear', this.appearContainer );
        	this.e.subscribe( 'show:detail', this.showDetail );
	        this.e.subscribe( 'draw:about', this.aboutLink );

	        this.e.publish( 'load' );
	    };




	    this.aboutLink = function() {

		    $("#aboutLink").click(function(){
		                                    
		        if(aboutFlg == "close"){ //open about

						$("#description").animate( { opacity: 'show'}, { duration: 600, easing: 'swing'} );
						$("#container" + currentNum).animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
						$("#radioBlock").animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
						$("#submenuBlock").animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );

						$("#abouLinkText").text("閉じる");
						aboutFlg = "open";

		        } else  if(aboutFlg == "open"){ //close about
						$("#description").animate( { opacity: 'hide'}, { duration: 100, easing: 'swing'} );
						$("#container" + currentNum).animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );
						$("#radioBlock").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );
						$("#submenuBlock").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );

						$("#abouLinkText").text("このサイトについて");

						resizeSVG();
						aboutFlg = "close";
		        };
		    });




		    $("#aboutLink").mouseover(function(){
				d3.select(this).transition().duration(0).style({fill:'#999999'}).style("cursor", "pointer");
		    });

		    $("#aboutLink").mouseout(function(){
				d3.select(this).transition().duration(0).style({fill:'#333333'});
		    });

	    }





		this.getData = function() {

		    queue()
		        .defer(d3.tsv, "assets/data/all.tsv")
		        .defer(d3.tsv, "assets/data/all_open.tsv")
		        .defer(d3.tsv, "assets/data/age203040.tsv")
		        .defer(d3.tsv, "assets/data/age5060.tsv")
		        .defer(d3.tsv, "assets/data/age70.tsv")
		        .defer(d3.tsv, "assets/data/area12.tsv")
		        .defer(d3.tsv, "assets/data/area3.tsv")
		        .defer(d3.tsv, "assets/data/area4.tsv")
		        .defer(d3.tsv, "assets/data/genderMale.tsv")
		        .defer(d3.tsv, "assets/data/genderFemale.tsv")
		        .defer(d3.tsv, "assets/data/detail0.tsv")
		        .defer(d3.tsv, "assets/data/detail1.tsv")
		        .defer(d3.tsv, "assets/data/detail2.tsv")
		        .defer(d3.tsv, "assets/data/detail3.tsv")
		        .defer(d3.tsv, "assets/data/detail4.tsv")
		        .defer(d3.tsv, "assets/data/detail5.tsv")
		        .defer(d3.tsv, "assets/data/detail6.tsv")
		        .defer(d3.tsv, "assets/data/detail7.tsv")
		        .defer(d3.tsv, "assets/data/detail8.tsv")
		        .await(loadReady);


		    function loadReady(_error, _all, _allopen, _age203040, 
		    					_age5060, _age70, _area12, _area3, _area4, 
		    					_genderMale, _genderFemale,
		    					_detail0, _detail1, _detail2, _detail3, _detail4, _detail5, _detail6, _detail7, _detail8)
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

		    	allOpenText = $.extend(true, [], _allopen);

		    	//detailWords = $.extend(true, [], _detail);

		    	detailWordsArray[0] = $.extend(true, [], _detail0);
		    	detailWordsArray[1] = $.extend(true, [], _detail1);
		    	detailWordsArray[2] = $.extend(true, [], _detail2);
		    	detailWordsArray[3] = $.extend(true, [], _detail3);
		    	detailWordsArray[4] = $.extend(true, [], _detail4);
		    	detailWordsArray[5] = $.extend(true, [], _detail5);
		    	detailWordsArray[6] = $.extend(true, [], _detail6);
		    	detailWordsArray[7] = $.extend(true, [], _detail7);
		    	detailWordsArray[8] = $.extend(true, [], _detail8);

            	self.e.publish('init:viewport');
		    }

		}


	    this.initViewport = function() {

	        layout1 = d3.layout.cloud()
	                .timeInterval(Infinity)
	                .size([width, height])
	                .fontSize(function(d) {
	                    return fontSizeScale(+d.value);
	                })
	                .text(function(d) {
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
	                    return d.key;
	                })
	                .on("end", draw);
	        layout3.font('YuGothic').spiral('archimedean');


	        fontSizeScale.domain([10, 255])

	        self.e.publish('draw:controll');
	        self.e.publish('draw:whole');

	    };




	    this.drawWhole = function() {

	    	//console.log("drawWhole");

			$("#submenuBlock").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );

	    	var _width = widthArray[0];
	        vis[0].attr("width", _width).attr("height", height);


	        var topText = vis[0].selectAll(".alltext")
	                .data(allOpenText)
	                .enter().append("text")
	                .attr("class", "alltext")
	                .attr("text-anchor", "middle")
	                .attr("transform", function(d,i) {

	                	// if (i%4 == 0) { //上端

		                // 	var _x = Math.random() * nowWidth;
		                // 	var _y = Math.random() * 10;

	                	// } else if (i%3 == 0) { //下端

	                	// 	var _x = Math.random() * nowWidth;
		                // 	var _y = Math.random() * nowHeight - 10;

	                	// } else if (i%2 == 0) { //左端

	                	// 	var _x = Math.random() * 10;
		                // 	var _y = Math.random() * nowHeight;

	                	// } else { //右端

	                	// 	var _x = Math.random() * nowWidth - 10;
		                // 	var _y = Math.random() * nowHeight;

	                	// }

	                	var _x = (Math.random() * nowWidth)/2;
	                	var _y = (Math.random() * nowHeight)/2;


	                	if (i%2 == 0) {

	                		_x *= -1; _y *= -1;

	                	};


	                	// var _r = Math.random() * 360;



	                	// var _x = Math.random() * bWidth/2 - Math.random() * bWidth/2;
	                	// // if (_x>0) {_x = _x + 200 };
	                	// // if (_x<0) {_x = _x - 200 };

	                	// var _y = Math.random() * bHeight/2 - Math.random() * bHeight/2;
	                	// if (_y>0) {_y = _y + 100 };
	                	// if (_y<0) {_y = _y - 100 };

	                	// console.log(_x);
	                	// console.log(_y);	                	
	                    return "translate(" + [_x, _y] + ")";
	                })
	                .style("font-size", function(d) {
	                    return d.size + "px";
	                })
					.style("font-family", "Yu Gothic")
	                .style("fill", function(d) {
	                    return  d3.rgb( d.rgb, d.rgb, d.rgb );
	                })
	                .style("opacity", 0.0)
					.style("text-shadow", function(d){
						return "2px 2px 0 #999";
					})
	                .attr("id", function(d,i){
	                	return d.id + vidId + i;
	                })
	                .on("mouseover", function (d, i){
	                	if (firstFlg) {
					    	d3.select(this).transition().duration(40).style({fill:'#000000'}).style("cursor", "pointer");
						    selectObj = d3.select(this);
						    originalSize = d.size;
						    startMouseAnime();
	                	}
	                })
	                .on("mouseout", function (d, i){
	                	if (firstFlg) {
						    d3.select(this).transition().duration(400).style("fill", function(d){
								return d3.rgb( d.rgb, d.rgb, d.rgb );
		                	});
		                	stopMouseAnime();
	                	}

	            	})
	                .on("click", function (d, i){
	                	if (firstFlg) {

						    d3.select("#"+ d.text + vidId + i).transition().duration(0).style("fill", function(d){
								return d3.rgb( d.rgb, d.rgb, d.rgb );
		                	})

		                	selectedWord = d.text;

		                	vidId = detectSvgNum( d3.select(this.parentNode.parentNode).attr("id") );
		                	//console.log("vidId", vidId);

		                	var _r = d.rotate * -0.5;
		                	var _tx = transWidth[currentNum] - d3.transform(d3.select(this).attr("transform")).translate[0];
		                	var _ty = transHeight[currentNum] - d3.transform(d3.select(this).attr("transform")).translate[1]-100;	                	

		                	d3.select(this.parentNode).transition().duration(1000).delay(1000).attr("transform", function(d) {
		                    	return "translate(" + _tx + "," + _ty + ")";
		                	});

		                	//選択した単語以外を非表示にする
		                	d3.select(this.parentNode).selectAll("text").transition().duration(500).style("opacity", .0);
		                	d3.select(this).transition().duration(50).style("opacity", 1.0);

		                    self.e.publish('show:detail');
	                	}
	                });


	        topText.transition()
	                .duration(function(d,i) {
	                    return i*500;
	                })
	                .style("opacity", function(d) {
	                    return  "0.4";
	                })
	                .text(function(d) {
	                    return d.text;
	                });





	        var messageText = vis[0].selectAll("#mtext")
	                .data(["被災者の声に耳を傾けてください。"])
	                .enter().append("text")
	                .attr("id", "mtext")
	                .attr("text-anchor", "middle")
	                .attr("font-weight", "bold")
	                .attr("transform", function(d,i) {
	                    return "translate(" + [0, -30] + ")";
	                })
	                .style("font-size", "30px")
					.style("font-family", "Yu Gothic")
	                .style("fill", function(d) {
	                    return  d3.rgb( 0, 0, 0 );
	                })
	                .style("opacity", 1.0)
	                .text(function(d) {
	                    return d;
	                });
	         //        .on("mouseover", function (d, i){
					    	// d3.select(this).transition().duration(1000).style({fill:'#FFFFFF'}).style("cursor", "pointer");
	         //        })
	         //        .on("mouseout", function (d, i){
					    	// d3.select(this).transition().duration(100).style({fill:'#000000'});
	         //        })
	                // .on("click", function (d, i){

	                // 		$("#mtext").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'} );

	                // 		$("#dtext0").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 0} );
	                // 		$("#dtext1").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 500} );
	                // 		$("#dtext2").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 1000} );

	                // 		$(".alltext").animate( { opacity: 1.0}, { duration: 2000, easing: 'swing'} );

	                // 		d3.selectAll(".alltext").transition().duration(2000).attr("transform", function(d,i) {
	                //     			return "translate(" + [d.translate0, d.translate1] + ")rotate(" + d.rotate + ")";
	                // 		});

		               //  	firstFlg = true;
	                // });


	        var descText = vis[0].selectAll("#dtext")
	                .data(["このサイトは、福島第一原子力発電所の事故で避難している住民へのアンケートを基に制作しました。", "アンケートの自由記述欄で使われた単語を「ワードクラウド」と呼ばれる手法で表現しています。", "単語をクリックすると、単語に紐づいた避難者の思いを読むことができます。"])
	                .enter().append("text")
	                .attr("id", function(d,i) {
	                	return "dtext" + i;
	                })
	                .attr("text-anchor", "middle")
	                .attr("font-weight", "bold")
	                .attr("transform", function(d,i) {
	                	var _v = i * 20 + 10;
	                    return "translate(" + [0 + ", " + _v] + ")";
	                })
	                .style("font-size", "14px")
					.style("font-family", "Yu Gothic")
	                .style("fill", function(d) {
	                    return  d3.rgb( 51, 51, 51 );
	                })
	                .style("opacity", 1.0)
	                .text(function(d) {
	                    return d;
	                });




	        /*
				make a start button
	        */
	        var _btnw = 160, _btnh = 40;

	        var btnGroup = vis[0].append("svg:g")
	                .attr("transform", function(d,i) {
	                	var _x = _btnw / 2 * -1;
	                	var _y = 80;
	                    return "translate(" + [_x + ", " + _y] + ")";
	                });

	        var btnStart = btnGroup.selectAll("#btnstart")
	                .data([0])
	                .enter().append("rect")
	                .attr("id", function(d,i) {
	                	return "btnstart";
	                })
	                .attr("transform", function(d,i) {
	                    return "translate(" + [0, 0] + ")";
	                })
	                .attr({
	                	width: _btnw,
	                	height: _btnh,
	                	fill: "#808080"
	                })
	                .on("mouseover", function (d, i){
					    	d3.select(this).transition().duration(1000).style({fill:'#FFFFFF'}).style("cursor", "pointer");
	                })
	                .on("mouseout", function (d, i){
					    	d3.select(this).transition().duration(400).style({fill:'#808080'});
	                })
	                .on("click", function (d, i){

	                		$("#mtext").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'} );

	                		$("#dtext0").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 0} );
	                		$("#dtext1").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 1000} );
	                		$("#dtext2").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 2000} );

	                		$("#btnstart").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 500} );
	                		$("#btnstarttext").animate( { opacity: 'hide'}, { duration: 1000, easing: 'swing'}, { delay: 500} );

	                		$(".alltext").animate( { opacity: 1.0}, { duration: 2000, easing: 'swing'} );

	                		d3.selectAll(".alltext").transition().duration(2000).attr("transform", function(d,i) {
	                    			return "translate(" + [d.translate0, d.translate1] + ")rotate(" + d.rotate + ")";
	                		});

		                	firstFlg = true;
	                });

	        var btnStartText = btnGroup.selectAll("#btnstarttext")
	                .data([0])
	                .enter().append("text")
	                .attr("id", function(d,i) {
	                	return "btnstarttext";
	                })
	                .attr("transform", function(d,i) {
	                	var _x = _btnw / 2;
	                	var _y = _btnh / 2 + _btnh / 8;
	                    return "translate(" + [_x + ", " + _y] + ")";
	                })
	                .attr("pointer-events", "none")
	                .attr("text-anchor", "middle")
	                .attr("font-weight", "bold")

	                .style("font-size", "14px")
					.style("font-family", "Yu Gothic")
	                .style("fill", function(d) {
	                    return  d3.rgb( 51, 51, 51 );
	                })
	                .style("opacity", 1.0)
	                .text(function(d) {
	                    return "開始する";
	                });
	    };


	    var hoverToggle = false; var originalSize;

	    function startMouseAnime( ) {
		    clearInterval(boxAnim);
		    boxAnim = setInterval(boxChange, interval);

	    };


	    function stopMouseAnime() {
		    clearInterval(boxAnim);
	    };    


		function boxChange(){
		    console.log("startMouseAnime");
		    console.log("hoverToggle", hoverToggle);
		    console.log("selectObj", selectObj);

		    // console.log(selectObj);

		    if (hoverToggle) {
		    	selectObj.transition().duration(interval).style({fill:'#FF0000'});
		    	hoverToggle = false;
		    } else {
		    	selectObj.transition().duration(interval).style({fill:'#FFFFFF'});
		    	hoverToggle = true;
		    };


		}




	    this.drawControll = function() {

	    	if (vid == 0) {
	        	layout1.stop().words( tags[vid] ).start();
	    	} else if ((vid == 7) || (vid == 8)) {
	        	layout2.stop().words( tags[vid] ).start();
	    	} else {
	        	layout3.stop().words( tags[vid] ).start();	
	    	}

	    };

	    function detectSvgNum(_string) {

	    	return parseInt( _string.substr(9, 1) );
	    }


	    function draw(data, bounds) {

	    	//console.log("vid", vid);

	    	var _width = widthArray[vid];

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
					.style("text-shadow", function(d){
						return "1px 1px 0 #999";
					})
	                .attr("id", function(d,i){
	                	//console.log(d.text + vid + i);
	                	return d.text + vid + i;
	                	//return d.text;
	                })
	                .text(function(d) {
	                    return d.text;
	                })
	                .on("mouseover", function (d, i){

	                	var _v = detectSvgNum( d3.select(this.parentNode.parentNode).attr("id") );
					    d3.select("#"+ d.text + _v + i).transition().duration(40).style({fill:'#000000'}).style("cursor", "pointer");

					    selectObj = d3.select("#"+ d.text + _v + i);
					    originalSize = d.size;
					    startMouseAnime();

	                })
	                .on("mouseout", function (d, i){

	                	var _v = detectSvgNum( d3.select(this.parentNode.parentNode).attr("id") );

					    d3.select("#"+ d.text + _v + i).transition().duration(400).style("fill", function(d){
							return grayScale( +d.value );
	                	})
	                	stopMouseAnime();
	            	})
	                .on("click", function (d, i){

	                	var _v = detectSvgNum( d3.select(this.parentNode.parentNode).attr("id") );

					    d3.select("#"+ d.text + _v + i).transition().duration(0).style("fill", function(d){
							return grayScale( +d.value );
	                	})

	                	selectedWord = d.text;

		                vidId = detectSvgNum( d3.select(this.parentNode.parentNode).attr("id") );

	                	// var _s = d3.select(this.parentNode.parentNode).attr("id");
	                	// vidId = parseInt( _s.substr(9, 1) );
	                	//console.log("vidId", vidId);

	                	var _r = d.rotate * -0.5;
	                	var _tx = transWidth[currentNum] - d3.transform(d3.select(this).attr("transform")).translate[0];
	                	var _ty = transHeight[currentNum] - d3.transform(d3.select(this).attr("transform")).translate[1]-100;	                	

	                	d3.select(this.parentNode).transition().duration(1000).delay(1000).attr("transform", function(d) {
	                    	return "translate(" + _tx + "," + _ty + ")";
	                	});

	                	//選択した単語以外を非表示にする
	                	d3.select(this.parentNode).selectAll("text").transition().duration(500).style("opacity", .0);
	                	d3.select(this).transition().duration(50).style("opacity", 1.0);




						switch (vidId) {
							case 0:
							  break;


							case 1:
								console.log("1");
								d3.select("#chartArea2").transition().duration(100).style("opacity", 0.0);
								d3.select("#chartArea3").transition().duration(100).style("opacity", 0.0);
							  break;
							case 2:
								console.log("2");
								d3.select("#chartArea1").transition().duration(100).style("opacity", 0.0);
								d3.select("#chartArea3").transition().duration(100).style("opacity", 0.0);
							  break;
							case 3:
								console.log("3");
								d3.select("#chartArea1").transition().duration(100).style("opacity", 0.0);
								d3.select("#chartArea2").transition().duration(100).style("opacity", 0.0);
							  break;


							case 4:
								console.log("4");
								d3.select("#chartArea5").transition().duration(100).style("opacity", 0.0);
								d3.select("#chartArea6").transition().duration(100).style("opacity", 0.0);
							  break;
							case 5:
								console.log("5");
								d3.select("#chartArea4").transition().duration(100).style("opacity", 0.0);
								d3.select("#chartArea6").transition().duration(100).style("opacity", 0.0);
							  break;
							case 6:
								console.log("6");
								d3.select("#chartArea4").transition().duration(100).style("opacity", 0.0);
								d3.select("#chartArea5").transition().duration(100).style("opacity", 0.0);
							  break;


							case 7:
								console.log("7");
								d3.select("#chartArea8").transition().duration(100).style("opacity", 0.0);
							  break;
							case 8:
								console.log("8");
								d3.select("#chartArea7").transition().duration(100).style("opacity", 0.0);
							  break;
						}



	                    self.e.publish('show:detail');
	                });

	        vid++;
	        if (vid<9) {
	            self.e.publish('draw:controll');
	        } else {
	            self.e.publish('draw:about');
	        }
	    }





	    this.showDetail = function() {

	    	console.log("selectedWord", selectedWord);
	    	console.log("vidId", vidId);



	    	for (var i=0; i<detailWordsArray[vidId].length; i++) {
	    		if (detailWordsArray[vidId][i]["keyword"] == selectedWord) {
	    			var _age 		= detailWordsArray[vidId][i]["age"];
	    			var _sex 		= detailWordsArray[vidId][i]["sex"];
	    			var _area 		= parseInt( detailWordsArray[vidId][i]["area"] );
	    			var _keyword	= detailWordsArray[vidId][i]["keyword"];	
	    			var _expression = detailWordsArray[vidId][i]["expression"];	    				    			
	    		}
	    	};

	    	// for (var i=0; i<detailWords.length; i++) {
	    	// 	if (detailWords[i]["keyword"] == selectedWord) {
	    	// 		var _age 		= detailWords[i]["age"];
	    	// 		var _sex 		= detailWords[i]["sex"];
	    	// 		var _area 		= parseInt( detailWords[i]["area"] );
	    	// 		var _keyword	= detailWords[i]["keyword"];	
	    	// 		var _expression = detailWords[i]["expression"];	    				    			
	    	// 	}
	    	// };

	    	var _areatext;


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
				default:
				  _areatext = "";
				  break;
			}

			if (_age != "") {
				_age += '歳 ';
			}

		    var options = {
		        title : '避難者の声' + '<div class="attr age">' + _sex + ' ' + _age + _areatext + '</div>',
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

		var menuItems = d3.select("#radioBlock").append('form').selectAll("span")
		    .data( ["全体", "年齢別", "避難区域別", "性別"] )
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
				resizeSVG();
		      	console.log("currentNum", currentNum);
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
				return d;
			});


		this.disappearContainer = function() {

			$("#container" + prevNum).animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );

			$("#submenu" + prevNum).animate( { opacity: 'hide'}, { duration: 0, easing: 'swing'} );
			self.e.publish('container:appear');
		    
		}


		this.appearContainer = function() {

			$("#container" + currentNum).animate( { opacity: 'show'}, { duration: 1000, easing: 'swing'} );
			$("#submenu" + currentNum).animate( { opacity: 'show'}, { duration: 1000, easing: 'swing'} );

		}


		this.opacityFull = function() {

			/*
			area appear
			*/
			switch (vidId) {
				case 0:
				  break;


				case 1:
					console.log("1");
					d3.select("#chartArea2").transition().duration(100).style("opacity", 1.0);
					d3.select("#chartArea3").transition().duration(100).style("opacity", 1.0);
				  break;
				case 2:
					console.log("2");
					d3.select("#chartArea1").transition().duration(100).style("opacity", 1.0);
					d3.select("#chartArea3").transition().duration(100).style("opacity", 1.0);
				  break;
				case 3:
					console.log("3");
					d3.select("#chartArea1").transition().duration(100).style("opacity", 1.0);
					d3.select("#chartArea2").transition().duration(100).style("opacity", 1.0);
				  break;


				case 4:
					console.log("4");
					d3.select("#chartArea5").transition().duration(100).style("opacity", 1.0);
					d3.select("#chartArea6").transition().duration(100).style("opacity", 1.0);
				  break;
				case 5:
					console.log("5");
					d3.select("#chartArea4").transition().duration(100).style("opacity", 1.0);
					d3.select("#chartArea6").transition().duration(100).style("opacity", 1.0);
				  break;
				case 6:
					console.log("6");
					d3.select("#chartArea4").transition().duration(100).style("opacity", 1.0);
					d3.select("#chartArea5").transition().duration(100).style("opacity", 1.0);
				  break;


				case 7:
					console.log("7");
					d3.select("#chartArea8").transition().duration(100).style("opacity", 1.0);
				  break;
				case 8:
					console.log("8");
					d3.select("#chartArea7").transition().duration(100).style("opacity", 1.0);
				  break;
			}


			/*
			letter appear
			*/
			vis[vidId].selectAll("text").transition().duration(1000).style("opacity", 1.0);
	                	
        	vis[vidId].transition().duration(1000).delay(0).attr("transform", function(d) {
            	// return "translate(" + transWidth[currentNum] + "," + transHeight[currentNum] + ")";
            	return "translate(" + transWidth[vidId] + "," + transHeight[vidId] + ")";
        	});

		}


		this.init.apply( this, arguments );
	};




	// $("#submenu1").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );
	// $("#submenu2").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );
	// $("#submenu3").animate( { opacity: 'show'}, { duration: 0, easing: 'swing'} );

	gg = new Graph;




	/* ---------------
	utility: window resize
	--------------- */
	var chart0 = $("#chartArea0");
	var chart1 = $("#chartArea1");
	var chart2 = $("#chartArea2");
	var chart3 = $("#chartArea3");
	var chart4 = $("#chartArea4");
	var chart5 = $("#chartArea5");
	var chart6 = $("#chartArea6");
	var chart7 = $("#chartArea7");
	var chart8 = $("#chartArea8");






	function resizeSVG() {

	    var targetWidth = container.width();
	    nowWidth = targetWidth;
	    nowHeight = Math.round(targetWidth / aspect);


		switch (currentNum) {
			case 0:
			    chart0.attr("width", nowWidth); chart0.attr("height", nowHeight);
				$("#container0").height(nowHeight);
				$("#svgcontainer0").height(nowHeight);
			break;

			case 1:
			    chart1.attr("width", nowWidth/3); chart1.attr("height", nowHeight);
			    chart2.attr("width", nowWidth/3); chart2.attr("height", nowHeight);
			    chart3.attr("width", nowWidth/3); chart3.attr("height", nowHeight);
				$("#container1").height(nowHeight);
				$("#svgcontainer1").height(nowHeight);
				$("#svgcontainer2").height(nowHeight);
				$("#svgcontainer3").height(nowHeight);
			  break;

			case 2:
			    chart4.attr("width", nowWidth/3); chart4.attr("height", nowHeight);
			    chart5.attr("width", nowWidth/3); chart5.attr("height", nowHeight);
			    chart6.attr("width", nowWidth/3); chart6.attr("height", nowHeight);
				$("#container2").height(nowHeight);
				$("#svgcontainer4").height(nowHeight);
				$("#svgcontainer5").height(nowHeight);
				$("#svgcontainer6").height(nowHeight);
			  break;

			case 3:
			    chart7.attr("width", nowWidth/2); chart7.attr("height", nowHeight);
			    chart8.attr("width", nowWidth/2); chart8.attr("height", nowHeight);
				$("#container3").height(nowHeight);
				$("#svgcontainer7").height(nowHeight);
				$("#svgcontainer8").height(nowHeight);
			  break;
		}

		$("#description").width(nowWidth);
		$("#description").height(nowHeight);

		$("#svgContainerContainer").height(nowHeight);

	}





	$(window).on("resize", function() {

		resizeSVG();

	}).trigger("resize");



});

var gg;


//モーダルウインドウを閉じたら
function closeDetailBtn() {
		gg.opacityFull();
}













