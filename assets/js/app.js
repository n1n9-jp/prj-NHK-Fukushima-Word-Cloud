import Eventer from './src/Eventer.js';
import DataLoader from './src/DataLoader.js';
import WordCloud from './src/WordCloud.js';
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

	// Data holders
	var tags = [];
	var allOpenText = [];
	var detailWordsArray = [];

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

		var aboutFlg = "close";
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
			this.e.subscribe('draw:about', this.aboutLink);

			// Subscribe to WordCloud events
			this.e.subscribe('word:clicked', this.handleWordClick);
			this.e.subscribe('word:clicked:whole', this.handleWholeWordClick);

			// Start data loading
			this.loader.load();
		};


		this.aboutLink = function () {

			$("#aboutLink").click(function () {

				if (aboutFlg == "close") { //open about

					var options = {
						title: 'このサイトについて',
						content: '<ul><li>' + 'アンケートは、ＮＨＫ福島放送局が２０１４年１１月～１２月にかけて、原発から半径１０キロ圏内にある大熊町、双葉町、浪江町、富岡町の４つの町から県の内外に避難している住民５０００人を対象に行い、１１５４人から回答を得ました。' + '</li><li>' + 'ワードクラウドとは、文章中で出現頻度が高い単語を複数選びだし、出現頻度に応じた大きさで図示する表現手法です。単語の抽出は、以下の形態素解析エンジンと辞書を利用し、名詞のみを抽出して集計しました。出現頻度が１０回以上の単語を掲載しています。' + '</li><ul><li>' + '利用した形態素解析エンジン：MeCab (version: 0.996)' + '</li><li>' + '利用した辞書：mecab-ipadic-neologd (version: 102)' + '</li></ul><li>' + '自由記述欄はアンケートの末尾に設けられ、将来の住まいや町の姿に関する要望や意見を伺いました。できるかぎり原文に忠実に掲載していますが、一部には、読みやすいように句読点を付け加えています。また、ワードクラウドを制作するにあたって、単語表記はＮＨＫの基準に合わせました。（例）「子供」→「子ども」' + '</li></ul><p>' + '制作）山本 智　管野 彰彦　矢崎 裕一（visualizing.jp）' + '</p>',
						buttons: [{
							label: '閉じる'
						}]
					};

					var zdal = new ZMODAL(options);

					d3.select('.z-modal-box').style("top", "50%");

					$("#aboutLink").animate({ opacity: 'hide' }, { duration: 0, easing: 'swing' });
					aboutFlg = "open";
				};
			});

			$("#aboutLink").mouseover(function () {
				d3.select(this).transition().duration(0).style({ fill: '#999999' }).style("cursor", "pointer");
			});

			$("#aboutLink").mouseout(function () {
				d3.select(this).transition().duration(0).style({ fill: '#333333' });
			});

		}


		this.onDataLoaded = function (loadedTags, loadedAllOpenText, loadedDetailWordsArray) {
			tags = loadedTags;
			allOpenText = loadedAllOpenText;
			detailWordsArray = loadedDetailWordsArray;

			self.e.publish('init:viewport');
		};


		this.initViewport = function () {
			self.wordCloud.initViewport();
			self.e.publish('draw:controll');
			self.e.publish('draw:whole');
		};

		this.drawControll = function () {
			self.wordCloud.startDrawing(tags);
		};

		this.drawWhole = function () {
			$("#submenuBlock").animate({ opacity: 'show' }, { duration: 0, easing: 'swing' });

			// Use WordCloud to draw the text
			const { topText, vis } = self.wordCloud.drawWhole(allOpenText, window.nowWidth, window.nowHeight);
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
				dialogMobile();
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

			if (currentNum == 0) {

				var wholeVoice = "";


				for (var j = 1; j < 9; j++) {

					var _age = "", _sex = "", _area = "", _keyword = "", _expression = "";

					for (var i = 0; i < detailWordsArray[j].length; i++) {
						if (detailWordsArray[j][i]["keyword"] == selectedWord) {
							_age = detailWordsArray[j][i]["age"];
							_sex = detailWordsArray[j][i]["sex"];
							_area = parseInt(detailWordsArray[j][i]["area"]);
							_keyword = detailWordsArray[j][i]["keyword"];
							_expression = detailWordsArray[j][i]["expression"];
						}
					};

					if (!_age == "") {

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

						wholeVoice = wholeVoice + '<div class="attr age">' + _sex + ' ' + _age + _areatext + '</div>' + '<div class="attr area">' + _expression + '</div>';
					}

				}


				//例外処理
				if (wholeVoice == "") {

					var _age = "", _sex = "", _area = "", _keyword = "", _expression = "";

					for (var k = 0; k < detailWordsArray[0].length; k++) {

						if (detailWordsArray[0][k]["keyword"] == selectedWord) {
							_age = detailWordsArray[0][k]["age"];
							_sex = detailWordsArray[0][k]["sex"];
							_area = parseInt(detailWordsArray[0][k]["area"]);
							_keyword = detailWordsArray[0][k]["keyword"];
							_expression = detailWordsArray[0][k]["expression"];

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

							wholeVoice = wholeVoice + '<div class="attr age">' + _sex + ' ' + _age + _areatext + '</div>' + '<div class="attr area">' + _expression + '</div>';

						}
					};
				}


				var options = {
					title: '避難者の声',
					content: wholeVoice,
					buttons: [{
						label: '閉じる'
					}]
				};

				var zdal = new ZMODAL(options);

				d3.select('.z-modal-box').style("top", "50%");

			} else {

				for (var i = 0; i < detailWordsArray[vidId].length; i++) {
					if (detailWordsArray[vidId][i]["keyword"] == selectedWord) {
						var _age = detailWordsArray[vidId][i]["age"];
						var _sex = detailWordsArray[vidId][i]["sex"];
						var _area = parseInt(detailWordsArray[vidId][i]["area"]);
						var _keyword = detailWordsArray[vidId][i]["keyword"];
						var _expression = detailWordsArray[vidId][i]["expression"];
					}
				};

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
					title: '避難者の声' + '<div class="attr age">' + _sex + ' ' + _age + _areatext + '</div>',
					content: '<div class="attr area">' + _expression + '</div>',
					buttons: [{
						label: '閉じる'
					}]
				};

				var zdal = new ZMODAL(options);

				d3.select('.z-modal-box').style("top", "60%");
			}


		};


		/* ---------------
		navigation
		--------------- */

		var menuItems = d3.select("#radioBlock").append('form').selectAll("span")
			.data(["全体", "年齢別", "避難区域別", "性別"])
			.enter().append("span").attr("class", "navColumn");

		menuItems.append("input")
			.attr({
				type: "radio",
				class: "nav",
				name: "nav",
				value: function (d, i) { return i; }
			})
			.attr('id', function (d, i) {
				return "id" + i;
			})
			.attr('value', function (d, i) {
				return d;
			})
			.property("checked", function (d, i) {
				if (i === prevNum) { return true; } else { return false; };
			})
			.on("change", function (d, i) {
				prevNum = currentNum;
				currentNum = i;
				resizeSVG();
				self.e.publish('container:disappear');
			});


		menuItems.append("label")
			.attr('for', function (d, i) {
				return "id" + i;
			})
			.attr({
				class: "btn"
			})
			.text(function (d, i) {
				return d;
			});


		this.disappearContainer = function () {

			$("#container" + prevNum).animate({ opacity: 'hide' }, { duration: 0, easing: 'swing' });
			$("#submenu" + prevNum).animate({ opacity: 'hide' }, { duration: 0, easing: 'swing' });
			self.e.publish('container:appear');

		}


		this.appearContainer = function () {

			$("#container" + currentNum).animate({ opacity: 'show' }, { duration: 1000, easing: 'swing' });
			$("#submenu" + currentNum).animate({ opacity: 'show' }, { duration: 1000, easing: 'swing' });

			if ((currentNum == 0) && (container.width() < 481)) {
				dialogMobile();
			}
		}




		function dialogMobile() {

			var options = {
				title: 'スマートフォンをご利用の方',
				content: '横向きでの閲覧をおすすめいたします。',
				buttons: [{
					label: '閉じる'
				}]
			};

			var zdal = new ZMODAL(options);
			d3.select('.z-modal-box').style("top", "50%");

		};


		this.opacityFull = function () {
			// Logic to restore opacity
			if (aboutFlg == "open") {
				$("#aboutLink").animate({ opacity: 'show' }, { duration: 0, easing: 'swing' });
				aboutFlg = "close";
			} else if (aboutFlg == "close") {
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
