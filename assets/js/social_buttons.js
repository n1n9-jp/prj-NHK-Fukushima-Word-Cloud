document.write('<script type="text/javascript" src="'+location.protocol+'//www.nhk.or.jp/common/social/js/social_default_parameter.js" charset="UTF-8"></script>');

function showSNS(buttonHash){
	var imgRoot = location.protocol+"//www.nhk.or.jp/common/social/img/"; // 画像パス
	var helpRoot = location.protocol+"//www.nhk.or.jp/common/social/"; //「？」ページのパス
	var idCount = countBoxId.countUp();
        if(idCount == "1"){
	    var showCount = "";
	}else{
	    var showCount = idCount;
	}
	var imgList = '<div id="nhksocialbtn'+showCount+'" class="nhksocialbtn_style"><div id="socialbookmark'+showCount+'" class="socialbookmark_style"><ul>';
	var boxList = '';
	var box = '<li id="social_bookmarkbox'+showCount+'" class="social_bookmarkbox_style"><a href="javascript:void(0);" onclick="ShowBox(\'social_sharebox'+idCount+'\');return false;"><img src="'+imgRoot+'share.png" alt="share"/></a><ul id="social_sharebox'+idCount+'"><a href="javascript:void(0);" onclick="ShowBox(\'social_sharebox'+idCount+'\');return false;"><img id="social_box_close'+idCount+'" src="'+imgRoot+'close_2.png" alt="close"/></a>';
	var count=0;
	if(buttonHash){
		var hash = buttonHash.hash;
	}else{
		if(typeof page != "undefined"){
			var hash = page.hash;
		}else{
			var hash = (new sysHash()).hash;
		}
	}
	for (var i in hash){
		if(hash[i] == "1"){
			switch (i) {
				case "t" :
					imgList += '<li id="social_t'+showCount+'" class="social_t_style"><a href="'+toSNS('t', hash)+'" target="_blank"><img src="'+imgRoot+'twitter.png" style="border-width: 0px;" alt="twitter"/></a></li>';
					break;
				case "m":
					imgList += '<li id="social_m'+showCount+'" class="social_m_style"><a href="'+toSNS('m', hash)+'" target="_blank"><img src="'+imgRoot+'bt_check_1.png" style="border-width: 0px;" alt="mixi"/></a></li>';
					break;
				case "g":
					boxList  += '<li id="social_b'+idCount+count+'"><a href="'+toSNS('g', hash)+'" target="_blank"><img src="'+imgRoot+'google.png" alt="google"/></a></li>';
					count ++;
					break;
				case "h":
					boxList  += '<li id="social_b'+idCount+count+'"><a href="'+toSNS('h', hash)+'" target="_blank"><img src="'+imgRoot+'hatena.png" alt="hatena"/></a></li>';
					count ++;
					break;
				case "f":
					imgList += '<li id="social_f'+showCount+'" class="social_f_style"><a href="'+toSNS('f', hash)+'" target="_blank"><img src="'+imgRoot+'f_share.png" style="border-width: 0px;" alt="facebook"/></a></li>';
					break;
				default:
					break;
			}
		}else if(hash[i] == "2"){
			switch (i) {
				case "t" :
					boxList += '<li id="social_b'+idCount+count+'"><a href="'+toSNS('t', hash)+'" target="_blank"><img src="'+imgRoot+'s_twitter.png" alt="twitter"/></a></li>';
					count ++;
					break;
				case "m":
					boxList += '<li id="social_b'+idCount+count+'"><a href="'+toSNS('m', hash)+'" target="_blank"><img src="'+imgRoot+'s_mixi.png" alt="mixi"/></a></li>';
					count ++;
					break;
				case "f":
					boxList += '<li id="social_b'+idCount+count+'"><a href="'+toSNS('f', hash)+'" target="_blank"><img src="'+imgRoot+'s_facebook.png" alt="facebook"/></a></li>';
					count ++;
					break;
				default:
					break;
			}
		}
	}

	if(boxList != ''){
		boxList = box + boxList;
		boxList += '</ul></li>';
		imgList += boxList;
	}

	if(hash["q"] != "1"){
		imgList += '<li id="social_about'+showCount+'"><a  href="javascript:void(window.open(\''+helpRoot+'help.html\', \'about_sns\', \'width=530,height=500,scrollbars=yes,resizable=yes\'));"><img id="social_q'+showCount+'" src="'+imgRoot+'q.png" style="border-style: none;" alt="help"/></a></li>';
	}

	var isVertical = hash["v"];
	var topFlg = hash["p"];
	var notice = hash["n"];
	var siconCntArry = new Array(hash["t"],hash["m"],hash["f"]);

	var cntSicon = cntSiconObj(siconCntArry);
	imgList += '<style><!-- .nhksocialbtn_style ul, .nhksocialbtn_style li { margin: 0; padding: 1px;} .socialbookmark_style { position: relative;} .socialbookmark_style li { list-style-type: none; float:left;} .social_t_style { position: relative;} .social_f_style { position: relative; margin-top: 1px; } .social_m_style { position: relative; } .social_bookmarkbox_style { position: relative; } .social_bookmarkbox_style a { border-style: none; } .social_bookmarkbox_style a img { border-style: none;} .social_bookmarkbox_style ul { display: none;} --></style>';
	if(isVertical == "1"){
		if(topFlg == "top"){
			imgList += getVerticalTopCss(imgRoot, cntSicon, idCount);
		}else{
			imgList += getVerticalCss(imgRoot, cntSicon, idCount);
		}
	}else{
		if(topFlg == "top"){
			imgList += getSideTopCss(imgRoot, cntSicon, idCount);
		}else{
			imgList += getSideCss(imgRoot, cntSicon, idCount);
		}
	}

	if(notice == "1"){
		imgList += '<li id="social_sns_notice'+showCount+'" style="clear:both;"><img src="'+imgRoot+'sns_notice.gif" style="border-width: 0px;" alt="notice"/></li>';
	}

	imgList += '</ul></div></div>';
	document.write(imgList);
}

// 横
function getSideCss(imgRoot, cntSicon, idCount){
	var position = {"box":"-50","b0":"-15","b1":"15","b2":"45"};
	switch (cntSicon) {
		case 0 :
			break;
		case 1 :
			position = {"box":"-50","b0":"-20","b1":"0","b2":"20","b3":"40"};
			break;
		case 2 :
			position = {"box":"-50","b0":"-25","b1":"-10","b2":"5","b3":"20","b4":"35"};
			break;
		case 3 :
			position = {"box":"-5","b0":"-32","b1":"-19","b2":"-5","b3":"10","b4":"25","b5":"38"};
			break;
		default:
			break;
	}
	return '<style><!-- #social_box_close'+idCount+' { position: absolute; top: 12px; right: 4px;} #social_sharebox'+idCount+' > a { display:block; } #social_sharebox'+idCount+' { background-image: url('+imgRoot+'s_bg01_b.gif); background-repeat: no-repeat; position: absolute; top: 20px; left: '+position["box"]+'px; width: 160px; height: 50px; } #social_sharebox'+idCount+' li { left:35px; position:relative; margin-left: 5px; padding: 2px; float:left } #social_b'+idCount+'0 a { position: absolute; top: 20px; left: '+position["b0"]+'px; } #social_b'+idCount+'1 a { position: absolute; top: 20px; left: '+position["b1"]+'px; } #social_b'+idCount+'2 a { position: absolute; top: 20px; left: '+position["b2"]+'px; } #social_b'+idCount+'3 a { position: absolute; top: 20px; left: '+position["b3"]+'px; } #social_b'+idCount+'4 a { position: absolute; top: 20px; left: '+position["b4"]+'px; } #social_b'+idCount+'5 a { position: absolute; top: 20px; left: '+position["b5"]+'px; } --></style>';
}

// 横(吹き出し上)
function getSideTopCss(imgRoot, cntSicon, idCount){
	var position = {"box":"-50","b0":"-15","b1":"5","b2":"20"};
	switch (cntSicon) {
		case 0 :
			break;
		case 1 :
			position = {"box":"-50","b0":"-25","b1":"-15","b2":"-5","b3":"5"};
			break;
		case 2 :
			position = {"box":"-50","b0":"-30","b1":"-28","b2":"-25","b3":"-23","b4":"-20"};
			break;
		case 3 :
			position = {"box":"-5","b0":"-30","b1":"-32","b2":"-35","b3":"-37","b4":"-40","b5":"-43"};
			break;
		default:
			break;
	}
	return '<style><!-- #social_box_close'+idCount+' { position: absolute; top: 2px; right: 4px;} #social_sharebox'+idCount+' > a { display:block; } #social_sharebox'+idCount+' { background-image: url('+imgRoot+'bg01_d.png); background-repeat: no-repeat; position: absolute; left: '+position["box"]+'px; width: 160px; height: 50px; top:-50px; } #social_sharebox'+idCount+' li { left:30px; position:relative; text-align: center; margin-left: 5px; padding: 2px; float:left; margin-top:-12px; } #social_b'+idCount+'0 a { position: relative; top: 20px; left: '+position["b0"]+'px; } #social_b'+idCount+'1 a { position: relative; top: 20px; left: '+position["b1"]+'px; } #social_b'+idCount+'2 a { position: relative; top: 20px; left: '+position["b2"]+'px; } #social_b'+idCount+'3 a { position: relative; top: 20px; left:'+position["b3"]+'px; } #social_b'+idCount+'4 a { position: relative; top: 20px; left: '+position["b4"]+'px; } #social_b'+idCount+'5 a { position: relative; top: 20px; left: '+position["b5"]+'px; } --></style>';
}

// 縦
function getVerticalCss(imgRoot, cntSicon, idCount){
	var isSafari = false;
	if(navigator.userAgent.indexOf("Safari") != -1){
		isSafari = true;
	}
	var position = {"b0":"20","b1":"30","b2":"40"};
	switch (cntSicon) {
		case 0 :
			break;
		case 1 :
			position = {"b0":"10","b1":"15","b2":"20","b3":"25"};
			break;
		case 2 :
			if(isSafari == true){
				position = {"b0":"12","b1":"12","b2":"12","b3":"12","b4":"12"};
			}else{
				position = {"b0":"10","b1":"8","b2":"5","b3":"2","b4":"0"};
			}
			break;
		case 3 :
			if(isSafari == true){
				position = {"b0":"3","b1":"3","b2":"3","b3":"3","b4":"3","b5":"3"};
			}else{
				position = {"b0":"5","b1":"0","b2":"-5","b3":"-10","b4":"-15","b5":"-20"};
			}
			break;
		default:
			break;
	}
	return ' <style><!-- #social_box_close'+idCount+' { position: absolute; top: 0; right: 0;} #social_sharebox'+idCount+' > a { display:block; } #social_sharebox'+idCount+' { background-image: url('+imgRoot+'bg02_a.png); background-repeat: no-repeat; position: absolute; width: 70px; height: 130px; top: 20px;} #social_sharebox'+idCount+' li { text-align: center; margin-left: 5px; padding: 2px; clear:both; } #social_b'+idCount+'0 a { position: relative; top: '+position["b0"]+'px; margin-left:15px;} #social_b'+idCount+'1 a { position: relative; top: '+position["b1"]+'px; margin-left:15px; } #social_b'+idCount+'2 a { position: relative; top: '+position["b2"]+'px; margin-left:15px;} #social_b'+idCount+'3 a { position: relative; top: '+position["b3"]+'px; margin-left:15px;} #social_b'+idCount+'4 a { position: relative; top: '+position["b4"]+'px; margin-left:15px;} #social_b'+idCount+'5 a { position: relative; top: '+position["b5"]+'px; margin-left:15px;} --></style>';
}

// 縦(吹き出し上)
function getVerticalTopCss(imgRoot, cntSicon, idCount){
	var isSafari = false;
	if(navigator.userAgent.indexOf("Safari") != -1){
		isSafari = true;
	}
	var position = {"b0":"20","b1":"30","b2":"40"};
	switch (cntSicon) {
		case 0 :
			break;
		case 1 :
			position = {"b0":"10","b1":"15","b2":"20","b3":"25"};
			break;
		case 2 :
			if(isSafari == true){
				position = {"b0":"12","b1":"12","b2":"12","b3":"12","b4":"12"};
			}else{
				position = {"b0":"10","b1":"8","b2":"5","b3":"2","b4":"0"};
			}
			break;
		case 3 :
			if(isSafari == true){
				position = {"b0":"3","b1":"3","b2":"3","b3":"3","b4":"3","b5":"3"};
			}else{
				position = {"b0":"5","b1":"0","b2":"-5","b3":"-10","b4":"-15","b5":"-20"};
			}
			break;
		default:
			break;
	}
	return ' <style><!-- #social_box_close'+idCount+' { position: absolute; top: 2px; right: 4px; } #social_sharebox'+idCount+' > a { display:block; } #social_sharebox'+idCount+' { background-image: url('+imgRoot+'bg02_a.png); background-repeat: no-repeat; position: absolute; width: 70px; height: 130px; top:-128px; left:0; } #social_sharebox'+idCount+' li { text-align: center; margin-left: 5px; padding: 2px; clear:both; } #social_b'+idCount+'0 a { position: relative; top: '+position["b0"]+'px; margin-left:15px;} #social_b'+idCount+'1 a { position: relative; top: '+position["b1"]+'px; margin-left:15px; } #social_b'+idCount+'2 a { position: relative; top: '+position["b2"]+'px; margin-left:15px;} #social_b'+idCount+'3 a { position: relative; top: '+position["b3"]+'px; margin-left:15px;} #social_b'+idCount+'4 a { position: relative; top: '+position["b4"]+'px; margin-left:15px;} #social_b'+idCount+'5 a { position: relative; top: '+position["b5"]+'px; margin-left:15px;} --></style>';
}

function toSNS(flag, hash){
	var url = location.protocol+"//cgi2.nhk.or.jp/common/social/social.cgi?flag="+flag;
	var title = hash['dtitle'];
	var subtitle = hash['ddesc'];
	var shorturl = hash['durl'];
	var descFlg = hash['d'];

	var ary = document.getElementsByTagName("meta");
	for(var i = 0 ; i < ary.length; i++){
		switch (ary[i].name) {
			case "description" :
				subtitle = ary[i].content;
				break;
			case "shorturl" :
				shorturl = ary[i].content;
				break;
			default:
				break;
		}
	}
	var titleTag = document.getElementsByTagName("title")[0];
	if(titleTag && titleTag.innerHTML != ""){
		title = titleTag.innerHTML;
	}
    
    	var ary = document.getElementsByTagName("meta");
	for(var i = 0 ; i < ary.length; i++){
		switch (ary[i].getAttribute('property')) {
			case "og:title" :
				title = ary[i].content;
				break;
			case "og:description" :
				subtitle = ary[i].content;
				break;
			case "og:url" :
				shorturl = ary[i].content;
				break;
			default:
				break;
		}
	}

	if(hash['title']){
		title = hash['title'];
	}
	url += "&title="+encodeURICustom(title+" ");

	if(hash['desc']){
		subtitle = hash['desc'];
	}
	if(descFlg != undefined && descFlg != "") {
		url += "&content="+encodeURICustom(subtitle);
	}

	if(hash['url']){
		shorturl = hash['url'];
	}
	url += "&url="+encodeURIComponent(shorturl);
	return url;
}

function ShowBox(nhksocialbtn) {
	var target = document.getElementById(nhksocialbtn);
	if ( target.style.display != "block" ) {
		target.style.display = "block";
	} else {
		target.style.display = "";
	}
}

function cntSiconObj(siconCntArry){
	var cnt=0;
	for (i = 0; i < siconCntArry.length; i++) {
		if(siconCntArry[i] == "2"){
			cnt++;
		}
	}
	return cnt;
}

function encodeURICustom(buf) {
	buf=encodeURIComponent(buf);
	buf=buf.replace(/\!/g, "%21");
	buf=buf.replace(/\'/g, "%27");
	buf=buf.replace(/\(/g, "%28");
	buf=buf.replace(/\)/g, "%29");
	buf=buf.replace(/\*/g, "%2a");
	buf=buf.replace(/\-/g, "%2d");
	buf=buf.replace(/\./g, "%2e");
	buf=buf.replace(/\~/g, "%7e");
	return buf;
}

var countBoxId = function(){
	countBoxId.count = 0;
	countBoxId.countUp = function(){
		return countBoxId.count += 1;
	}
}
countBoxId();