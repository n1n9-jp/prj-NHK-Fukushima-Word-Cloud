import Eventer from './src/Eventer.js';
import DataLoader from './src/DataLoader.js';
import WordCloud from './src/WordCloud.js';
import UIManager from './src/UIManager.js';
import DataStore from './src/DataStore.js';
import DetailView from './src/DetailView.js';
import { VIEWPORT, DIMENSIONS, WIDTH_ARRAY, TRANS_WIDTH, TRANS_HEIGHT } from './src/Config.js';

$(function () {

	/* ---------------
	Eventer function
	--------------- */
	var eventer = new Eventer();


	/* ---------------
	Initialize
	--------------- */

	var currentNum = 0, prevNum = 0;
	var vis = new Array(); var vid = 1; var vidId = 0;
	var fontSizeScale = d3.scale['sqrt']().range([14, 180]);
	var layout1, layout2, layout3;
	var selectedWord = "";

	// Data holders removed (managed by DataStore)

	// Clean up old D3 setup code
	var container = $("#svgContainerContainer");

	/*  for timer */
	var boxAnim;
	var interval = 1000;


	var Graph = function () {


		var self = this;
		this.e = eventer;
		this.loader = new DataLoader(this.e);
		this.wordCloud = new WordCloud(this.e);
		this.ui = new UIManager();
		this.dataStore = new DataStore();
		this.detailView = new DetailView();

		var letterTapFlagTop = false;
		var letterTapFlag = true;
		var selectObj;
		var originalSize, hoverToggle;
		var btnHoverToggle = false;

		var grayScale = d3.scale.linear()
			.domain([1, 80])
			.range(["#DDD", "#FFF"]);

		this.init = function () {
			// Listen for data loaded event
			this.e.subscribe('data:loaded', this.onDataLoaded);

			this.e.subscribe('init:viewport', this.initViewport);
			this.e.subscribe('draw:controll', this.drawControll);
			this.e.subscribe('draw:whole', this.drawWhole);
			this.e.subscribe('container:disappear', this.disappearContainer);
			this.e.subscribe('container:appear', this.appearContainer);
			this.e.subscribe('show:detail', this.showDetail);
			// this.e.subscribe('draw:about', this.aboutLink); // handled by UI manager now implicitly or we call setup

			// Initialize UI components
			this.ui.initNavigation(["全体", "年齢別", "避難区域別", "性別"], currentNum, function (index) {
				prevNum = currentNum;
				currentNum = index;
				resizeSVG();
				self.e.publish('container:disappear');
			});

			this.ui.setupAboutLink();

			// Subscribe to WordCloud events
			this.e.subscribe('word:clicked', this.handleWordClick);
			this.e.subscribe('word:clicked:whole', this.handleWholeWordClick);

			// Re-bind draw:about if needed (WordCloud emits it, but UIManager handles click)
			this.e.subscribe('draw:about', () => {
				// Trigger click on about link or similar if needed, 
				// but original logic was just setting up the listener.
				// UIManager.setupAboutLink handles the click listener.
			});

			// Start data loading
			this.loader.load();
		};


		this.onDataLoaded = function (loadedTags, loadedAllOpenText, loadedDetailWordsArray) {
			// Use DataStore
			self.dataStore.setData(loadedTags, loadedAllOpenText, loadedDetailWordsArray);
			self.e.publish('init:viewport');
		};


		this.initViewport = function () {
			self.wordCloud.initViewport();
			self.e.publish('draw:controll');
			self.e.publish('draw:whole');
		};

		this.drawControll = function () {
			// Get tags from store
			self.wordCloud.startDrawing(self.dataStore.getTags());
		};

		this.drawWhole = function () {
			$("#submenuBlock").animate({ opacity: 'show' }, { duration: 0, easing: 'swing' });

			// Use WordCloud to draw the text, passing data from store
			const { topText, vis } = self.wordCloud.drawWhole(self.dataStore.getAllOpenText(), window.nowWidth, window.nowHeight);
			if (!vis) return;

			topText.transition()
				.duration(function (d, i) {
					return i * 500;
				})
				.style("opacity", function (d) {
					return "0.4";
				})
				.text(function (d) {
					return d.text;
				});


			var messageText = vis.selectAll("#mtext")
				.data(["避難者が今、最も気にかけている言葉は何だろう？"])
				.enter().append("text")
				.attr("id", "mtext")
				.attr("text-anchor", "middle")
				.attr("font-weight", "bold")
				.attr("transform", function (d, i) {
					return "translate(" + [0, -30] + ")";
				})
				.style("font-size", "30px")
				// .style("font-family", "Yu Gothic")
				.style("fill", function (d) {
					return d3.rgb(0, 0, 0);
				})
				.style("opacity", 1.0)
				.text(function (d) {
					return d;
				});


			var descText = vis.selectAll("#dtext")
				.data(["「生活」「町」「家」「原発」。去年、１０００人以上の避難者に行ったアンケートの自由記述欄で使われていた言葉です。", "そこには、長引く避難生活の不満や将来への不安など、避難者の生の声が刻まれていました。", "自由記述欄で使われた頻度の高い単語を選び出し、「ワードクラウド」と呼ばれる手法で表現しました。", "単語のサイズが大きいほど、使用頻度が高いことを示しています。単語をクリックすると、単語に紐づいた避難者の思いを読むことができます。"])
				.enter().append("text")
				.attr("id", function (d, i) {
					return "dtext" + i;
				})
				.attr("text-anchor", "middle")
				.attr("font-weight", "bold")
				.attr("transform", function (d, i) {
					var _v = i * 20 + 10;
					return "translate(" + [0 + ", " + _v] + ")";
				})
				.style("font-size", "14px")
				// .style("font-family", "Yu Gothic")
				.style("fill", function (d) {
					return d3.rgb(51, 51, 51);
				})
				.style("opacity", 1.0)
				.text(function (d) {
					return d;
				});


			/*
		make a start button
	*/
			var _btnw = 160, _btnh = 40;

			var btnGroup = vis.append("svg:g")
				.attr("transform", function (d, i) {
					var _x = _btnw / 2 * -1;
					var _y = 100;
					return "translate(" + [_x + ", " + _y] + ")";
				});

			// ... (Button events similar to before, but we need to pass start callback) ...
			var btnStart = btnGroup.selectAll("#btnstart")
				.data([0])
				.enter().append("rect")
				.attr("id", "btnstart")
				.attr("transform", "translate(0,0)")
				.attr({
					width: _btnw,
					height: _btnh,
					fill: "#333333"
				})
				.on("mouseover", function (d, i) {
					d3.select(this).transition().duration(1000).style({ fill: '#FFFFFF' }).style("cursor", "pointer");
					d3.select("#btnstarttext").transition().duration(1000).style({ fill: '#000' });

					if (!btnHoverToggle) {
						btnHoverToggle = true;
						var $box = Snap(this);
						$box.attr({ "transform": "scale(0.8, 0.8, 0, 0)" });
						$box.animate({ "transform": "scale(1.6, 1.6, 0, 0)" }, 1000, mina.elastic);
					}
				})
				.on("mouseout", function (d, i) {
					d3.select(this).transition().duration(400).style({ fill: '#333333' });
					d3.select("#btnstarttext").transition().duration(1000).style({ fill: '#FFF' });

					var $box = Snap(this);
					$box.animate({ "transform": "scale(1.0, 1.0, 0, 0)" }, 500, mina.elastic);
					btnHoverToggle = false;
				})
				.on("click", function (d, i) {
					hoverToggle = true;
					$("#mtext").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' });
					$("#dtext0").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' }, { delay: 0 });
					$("#dtext1").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' }, { delay: 1000 });
					$("#dtext2").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' }, { delay: 2000 });
					$("#dtext3").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' }, { delay: 3000 });

					$("#btnstart").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' }, { delay: 500 });
					$("#btnstarttext").animate({ opacity: 'hide' }, { duration: 1000, easing: 'swing' }, { delay: 500 });

					$(".alltext").animate({ opacity: 1.0 }, { duration: 2000, easing: 'swing' });

					d3.timer(startHover(), 2000);

					// Let WordCloud know animations are starting so it can enable interactions if needed
					d3.selectAll(".alltext").transition().duration(2000).attr("transform", function (d, i) {
						return "translate(" + [d.translate0, d.translate1] + ")rotate(" + d.rotate + ")";
					});
				});

			// Button text
			var btnStartText = btnGroup.selectAll("#btnstarttext")
				.data([0])
				.enter().append("text")
				.attr("id", "btnstarttext")
				.attr("transform", function (d, i) {
					var _x = _btnw / 2;
					var _y = _btnh / 2 + _btnh / 8;
					return "translate(" + [_x + ", " + _y] + ")";
				})
				.attr("pointer-events", "none")
				.attr("text-anchor", "middle")
				.attr("font-weight", "bold")
				.style("font-size", "14px")
				.style("fill", "#FFF")
				.style("opacity", 1.0)
				.text("開始する");

			if (container.width() < 481) {
				// Delegate to UI manager if needed, but appearedContainer handles it?
				// app.js flow calls dialogMobile in appearContainer.
				// UIManager.showContainer handles it.
			}
		};

		// Handlers for events published by WordCloud
		this.handleWholeWordClick = function (data) {
			const { element, d, i } = data;
			// UI logic to move word to center and show details
			selectedWord = d.text;
			vidId = 0; // Fixed for whole

			d3.select("#" + d.text + "0" + i).transition().duration(0).style("fill", d3.rgb(d.rgb, d.rgb, d.rgb));

			var _tx = TRANS_WIDTH[currentNum] - d3.transform(d3.select(element).attr("transform")).translate[0];
			var _ty = TRANS_HEIGHT[currentNum] - d3.transform(d3.select(element).attr("transform")).translate[1] - 100;

			d3.select(element.parentNode).transition().duration(1000).delay(1000).attr("transform", "translate(" + _tx + "," + _ty + ")");

			d3.select(element.parentNode).selectAll("text").transition().duration(500).style("opacity", .0);
			d3.select(element).transition().duration(50).style("opacity", 1.0);
			d3.select(element).transition().duration(50).style("fill", d3.rgb(d.rgb, d.rgb, d.rgb));

			self.e.publish('show:detail');
		};

		this.handleWordClick = function (data) {
			const { element, d, vidId: _vidId, i } = data;
			selectedWord = d.text;
			vidId = _vidId;

			var _tx = TRANS_WIDTH[currentNum] - d3.transform(d3.select(element).attr("transform")).translate[0];
			var _ty = TRANS_HEIGHT[currentNum] - d3.transform(d3.select(element).attr("transform")).translate[1] - 100;

			d3.select(element.parentNode).transition().duration(1000).delay(1000).attr("transform", "translate(" + _tx + "," + _ty + ")");

			d3.select(element.parentNode).selectAll("text").transition().duration(500).style("opacity", .0);
			d3.select(element).transition().duration(50).style("opacity", 1.0)
				.style("fill", "#FFF");

			// Hide other charts
			// Logic adapted from original switch(vidId)
			// Using simple logic to hide others
			// TODO: Clean this up, but keeping compatibility for now
			if (vidId === 1) { d3.select("#chartArea2").transition().duration(100).style("opacity", 0.0); d3.select("#chartArea3").transition().duration(100).style("opacity", 0.0); }
			if (vidId === 2) { d3.select("#chartArea1").transition().duration(100).style("opacity", 0.0); d3.select("#chartArea3").transition().duration(100).style("opacity", 0.0); }
			if (vidId === 3) { d3.select("#chartArea1").transition().duration(100).style("opacity", 0.0); d3.select("#chartArea2").transition().duration(100).style("opacity", 0.0); }

			if (vidId === 4) { d3.select("#chartArea5").transition().duration(100).style("opacity", 0.0); d3.select("#chartArea6").transition().duration(100).style("opacity", 0.0); }
			if (vidId === 5) { d3.select("#chartArea4").transition().duration(100).style("opacity", 0.0); d3.select("#chartArea6").transition().duration(100).style("opacity", 0.0); }
			if (vidId === 6) { d3.select("#chartArea4").transition().duration(100).style("opacity", 0.0); d3.select("#chartArea5").transition().duration(100).style("opacity", 0.0); }

			if (vidId === 7) { d3.select("#chartArea8").transition().duration(100).style("opacity", 0.0); }
			if (vidId === 8) { d3.select("#chartArea7").transition().duration(100).style("opacity", 0.0); }

			self.e.publish('show:detail');
		};

		var startHover = function () {
			return function () {
				self.wordCloud.setLetterTapFlagTop(true);
				return true;
			}
		};

		// Removing generic drawControll and draw functions as they are now in WordCloud class


		this.showDetail = function () {
			// New logic using DataStore and DetailView
			const result = self.dataStore.findDetails(selectedWord, currentNum);
			const options = self.detailView.generateModalOptions(result, selectedWord);

			const zdal = new ZMODAL(options);

			// Adjust modal position - logic from original code
			if (currentNum === 0) {
				d3.select('.z-modal-box').style("top", "50%");
			} else {
				d3.select('.z-modal-box').style("top", "60%");
			}
		};



		this.disappearContainer = function () {
			self.ui.hideContainer(prevNum, function () {
				self.e.publish('container:appear');
			});
		}

		this.appearContainer = function () {
			self.ui.showContainer(currentNum, (currentNum == 0 && container.width() < 481));
		}

		this.opacityFull = function () {
			// Logic to restore opacity
			// Delegate aboutLink restoration to UI manager
			if (self.ui.restoreAboutLink()) {
				// handled
			} else {
				// ... rest of opacity logic
				// Restore via D3 selectors directly as we don't hold 'vis' array here anymore
				// or better, delegate to WordCloud

				switch (vidId) {
					case 0: break;
					case 1:
						d3.select("#chartArea2").transition().duration(100).style("opacity", 1.0);
						d3.select("#chartArea3").transition().duration(100).style("opacity", 1.0);
						break;
					case 2:
						d3.select("#chartArea1").transition().duration(100).style("opacity", 1.0);
						d3.select("#chartArea3").transition().duration(100).style("opacity", 1.0);
						break;
					case 3:
						d3.select("#chartArea1").transition().duration(100).style("opacity", 1.0);
						d3.select("#chartArea2").transition().duration(100).style("opacity", 1.0);
						break;
					case 4:
						d3.select("#chartArea5").transition().duration(100).style("opacity", 1.0);
						d3.select("#chartArea6").transition().duration(100).style("opacity", 1.0);
						break;
					case 5:
						d3.select("#chartArea4").transition().duration(100).style("opacity", 1.0);
						d3.select("#chartArea6").transition().duration(100).style("opacity", 1.0);
						break;
					case 6:
						d3.select("#chartArea4").transition().duration(100).style("opacity", 1.0);
						d3.select("#chartArea5").transition().duration(100).style("opacity", 1.0);
						break;
					case 7:
						d3.select("#chartArea8").transition().duration(100).style("opacity", 1.0);
						break;
					case 8:
						d3.select("#chartArea7").transition().duration(100).style("opacity", 1.0);
						break;
				}

				/*
				letter appear
				*/
				const currentChart = d3.select("#chartArea" + vidId);

				if (vidId === 0) {
					self.wordCloud.resetColorsTop();
				} else {
					self.wordCloud.resetColors(vidId);
				}

				// Reset transform
				currentChart.select("g").transition().duration(1000).delay(0).attr("transform", "translate(" + TRANS_WIDTH[vidId] + "," + TRANS_HEIGHT[vidId] + ")");

				// Reset flags in WordCloud
				if (vidId == 0) {
					self.wordCloud.setLetterTapFlagTop(true);
				} else {
					self.wordCloud.setLetterTapFlag(true);
				}
			}
		};

		this.init.apply(this, arguments);
	}; // Close Graph class

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
		window.nowWidth = targetWidth;
		window.nowHeight = Math.round(targetWidth / DIMENSIONS.aspect);

		switch (currentNum) {
			case 0:
				chart0.attr("width", nowWidth); chart0.attr("height", nowHeight);
				$("#container0").height(nowHeight);
				$("#svgcontainer0").height(nowHeight);
				break;

			case 1:
				chart1.attr("width", Math.floor(nowWidth / 3)); chart1.attr("height", nowHeight);
				chart2.attr("width", Math.floor(nowWidth / 3)); chart2.attr("height", nowHeight);
				chart3.attr("width", Math.floor(nowWidth / 3)); chart3.attr("height", nowHeight);
				$("#container1").height(nowHeight);
				$("#svgcontainer1").height(nowHeight);
				$("#svgcontainer2").height(nowHeight);
				$("#svgcontainer3").height(nowHeight);
				break;

			case 2:
				chart4.attr("width", Math.floor(nowWidth / 3)); chart4.attr("height", nowHeight);
				chart5.attr("width", Math.floor(nowWidth / 3)); chart5.attr("height", nowHeight);
				chart6.attr("width", Math.floor(nowWidth / 3)); chart6.attr("height", nowHeight);
				$("#container2").height(nowHeight);
				$("#svgcontainer4").height(nowHeight);
				$("#svgcontainer5").height(nowHeight);
				$("#svgcontainer6").height(nowHeight);
				break;

			case 3:
				chart7.attr("width", Math.floor(nowWidth / 2)); chart7.attr("height", nowHeight);
				chart8.attr("width", Math.floor(nowWidth / 2)); chart8.attr("height", nowHeight);
				$("#container3").height(nowHeight);
				$("#svgcontainer7").height(nowHeight);
				$("#svgcontainer8").height(nowHeight);
				break;
		}

		$("#description").width(nowWidth);
		$("#description").height(nowHeight);

		$("#svgContainerContainer").height(nowHeight);

	}


	$(window).on("resize", function () {
		resizeSVG();
	}).trigger("resize");


});

var gg;


//モーダルウインドウを閉じたら
function closeDetailBtn() {
	// delete zdal;
	gg.opacityFull();
}
window.closeDetailBtn = closeDetailBtn;
