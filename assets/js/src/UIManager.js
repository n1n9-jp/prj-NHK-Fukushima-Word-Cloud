export default class UIManager {
    constructor() {
        this.aboutFlg = "close";
    }

    /**
     * Initialize Navigation Menu (Radio Buttons)
     * @param {Array} items - Array of navigation labels e.g. ["全体", ...]
     * @param {Number} initialIndex - Initially selected index
     * @param {Function} callback - Callback function on change (index) => void
     */
    initNavigation(items, initialIndex, callback) {
        const menuItems = d3.select("#radioBlock").append('form').selectAll("span")
            .data(items)
            .enter().append("span").attr("class", "navColumn");

        menuItems.append("input")
            .attr({
                type: "radio",
                class: "nav",
                name: "nav",
                value: (d, i) => i
            })
            .attr('id', (d, i) => "id" + i)
            .attr('value', (d, i) => d)
            .property("checked", (d, i) => i === initialIndex)
            .on("change", function (d, i) {
                if (callback) callback(i);
            });

        menuItems.append("label")
            .attr('for', (d, i) => "id" + i)
            .attr('class', "btn")
            .text((d, i) => d);
    }

    /**
     * Hide specified container
     * @param {Number} index 
     * @param {Function} onComplete - Optional callback when animation finishes
     */
    hideContainer(index, onComplete) {
        // Using jQuery animate as per original code
        const $container = $("#container" + index);
        const $submenu = $("#submenu" + index);

        // Use promise-like approach or simple callback for the last one
        $container.animate({ opacity: 'hide' }, { duration: 0, easing: 'swing' });
        $submenu.animate({ opacity: 'hide' }, {
            duration: 0,
            easing: 'swing',
            complete: onComplete
        });

        // If onComplete is provided but elements don't exist, generic fail-safe?
        // Since duration is 0, it's synchronous-like in jQuery usually, 
        // but callback ensures sequence.
        if ($container.length === 0 && onComplete) onComplete();
    }

    /**
     * Show specified container
     * @param {Number} index 
     * @param {Boolean} isMobile - Whether to show mobile dialog for index 0
     */
    showContainer(index, isMobile) {
        $("#container" + index).animate({ opacity: 'show' }, { duration: 1000, easing: 'swing' });
        $("#submenu" + index).animate({ opacity: 'show' }, { duration: 1000, easing: 'swing' });

        if (index === 0 && isMobile) {
            this.showMobileDialog();
        }
    }

    /**
     * Show Mobile Alert Dialog
     */
    showMobileDialog() {
        const options = {
            title: 'スマートフォンをご利用の方',
            content: '横向きでの閲覧をおすすめいたします。',
            buttons: [{
                label: '閉じる'
            }]
        };

        const zdal = new ZMODAL(options);
        d3.select('.z-modal-box').style("top", "50%");
    }

    /**
     * Setup 'About' Link behavior
     */
    setupAboutLink() {
        const self = this;
        $("#aboutLink").click(function () {
            if (self.aboutFlg == "close") { // open about
                const options = {
                    title: 'このサイトについて',
                    content: '<ul><li>' + 'アンケートは、ＮＨＫ福島放送局が２０１４年１１月～１２月にかけて、原発から半径１０キロ圏内にある大熊町、双葉町、浪江町、富岡町の４つの町から県の内外に避難している住民５０００人を対象に行い、１１５４人から回答を得ました。' + '</li><li>' + 'ワードクラウドとは、文章中で出現頻度が高い単語を複数選びだし、出現頻度に応じた大きさで図示する表現手法です。単語の抽出は、以下の形態素解析エンジンと辞書を利用し、名詞のみを抽出して集計しました。出現頻度が１０回以上の単語を掲載しています。' + '</li><ul><li>' + '利用した形態素解析エンジン：MeCab (version: 0.996)' + '</li><li>' + '利用した辞書：mecab-ipadic-neologd (version: 102)' + '</li></ul><li>' + '自由記述欄はアンケートの末尾に設けられ、将来の住まいや町の姿に関する要望や意見を伺いました。できるかぎり原文に忠実に掲載していますが、一部には、読みやすいように句読点を付け加えています。また、ワードクラウドを制作するにあたって、単語表記はＮＨＫの基準に合わせました。（例）「子供」→「子ども」' + '</li></ul><p>' + '制作）山本 智　管野 彰彦　矢崎 裕一（visualizing.jp）' + '</p>',
                    buttons: [{
                        label: '閉じる',
                        callback: function () {
                            // When closing modal, fade out the link again? 
                            // Original code logic:
                            // $("#aboutLink").animate({ opacity: 'hide' }, ...); when OPENING.
                            // It doesn't show explicit logic for reappearing aboutLink here, 
                            // but app.js opacityFull had logic:
                            // if (aboutFlg == "open") { $("#aboutLink").animate({ opacity: 'show' }...); aboutFlg="close"; }
                            // This depends on the global close callback mechanism.
                        }
                    }]
                };

                const zdal = new ZMODAL(options);
                d3.select('.z-modal-box').style("top", "50%");

                $("#aboutLink").animate({ opacity: 'hide' }, { duration: 0, easing: 'swing' });
                self.aboutFlg = "open";
            }
        });

        $("#aboutLink").mouseover(function () {
            d3.select(this).transition().duration(0).style({ fill: '#999999' }).style("cursor", "pointer");
        });

        $("#aboutLink").mouseout(function () {
            d3.select(this).transition().duration(0).style({ fill: '#333333' });
        });
    }

    /**
     * Restore About Link logic (called when modal closes)
     */
    restoreAboutLink() {
        if (this.aboutFlg == "open") {
            $("#aboutLink").animate({ opacity: 'show' }, { duration: 0, easing: 'swing' });
            this.aboutFlg = "close";
            return true; // Indicate that about link was handled
        }
        return false;
    }
}
