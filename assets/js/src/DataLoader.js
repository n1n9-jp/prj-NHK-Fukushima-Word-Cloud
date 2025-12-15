export default class DataLoader {
    constructor(eventer) {
        this.eventer = eventer;
    }

    load() {
        // Check if d3 and queue are available globally (loaded via script tags)
        if (typeof queue === 'undefined' || typeof d3 === 'undefined') {
            console.error('D3.js or queue.js not loaded');
            return;
        }

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
            .await(this.loadReady.bind(this));
    }

    loadReady(error, all, allopen, age203040,
        age5060, age70, area12, area3, area4,
        genderMale, genderFemale,
        detail0, detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8) {

        if (error) {
            console.error("Data load error:", error);
            return;
        }

        const tags = [];
        tags[0] = $.extend(true, [], all);
        tags[1] = $.extend(true, [], age203040);
        tags[2] = $.extend(true, [], age5060);
        tags[3] = $.extend(true, [], age70);
        tags[4] = $.extend(true, [], area12);
        tags[5] = $.extend(true, [], area3);
        tags[6] = $.extend(true, [], area4);
        tags[7] = $.extend(true, [], genderMale);
        tags[8] = $.extend(true, [], genderFemale);

        const allOpenText = $.extend(true, [], allopen);

        const detailWordsArray = [];
        detailWordsArray[0] = $.extend(true, [], detail0);
        detailWordsArray[1] = $.extend(true, [], detail1);
        detailWordsArray[2] = $.extend(true, [], detail2);
        detailWordsArray[3] = $.extend(true, [], detail3);
        detailWordsArray[4] = $.extend(true, [], detail4);
        detailWordsArray[5] = $.extend(true, [], detail5);
        detailWordsArray[6] = $.extend(true, [], detail6);
        detailWordsArray[7] = $.extend(true, [], detail7);
        detailWordsArray[8] = $.extend(true, [], detail8);

        // Publish result
        this.eventer.publish('data:loaded', [tags, allOpenText, detailWordsArray]);
    }
}
