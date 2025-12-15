import { DIMENSIONS, WIDTH_ARRAY, TRANS_WIDTH, TRANS_HEIGHT } from './Config.js';
// Assume global d3, Snap, mina (from existing script tags)

export default class WordCloud {
    constructor(eventer) {
        this.eventer = eventer;
        this.fontSizeScale = d3.scale['sqrt']().range([14, 180]);

        // Layouts instances
        this.layouts = {};

        // Visualization containers (SVG groups)
        this.vis = [];

        // State
        this.currentData = null; // Currently processing tags
        this.vid = 1; // Current view ID logic preserved from original

        // For letter animation
        this.letterTapFlag = true;
        this.letterTapFlagTop = false;
        this.hoverToggle = false;
        this.selectObj = null;
        this.originalSize = 0;

        // Gray scale for word text
        this.grayScale = d3.scale.linear()
            .domain([1, 80])
            .range(["#DDD", "#FFF"]);

        // Initialize SVGs immediately
        this._initSVGs();
    }

    _initSVGs() {
        // Recreating the SVG initialization logic from app.js
        const createSvg = (containerId, width, height, viewBoxStr, chartId, transX, transY) => {
            return d3.select(containerId).append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", viewBoxStr)
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("id", chartId)
                .append("g")
                .attr("transform", "translate(" + transX + "," + transY + ")");
        };

        const h = DIMENSIONS.height;

        /* all */
        this.vis[0] = createSvg("#svgcontainer0", WIDTH_ARRAY[0], h, "0 0 1200 500", "chartArea0", TRANS_WIDTH[0], TRANS_HEIGHT[0]);

        /* age */
        this.vis[1] = createSvg("#svgcontainer1", WIDTH_ARRAY[1], h, "0 0 400 500", "chartArea1", TRANS_WIDTH[1], TRANS_HEIGHT[1]);
        this.vis[2] = createSvg("#svgcontainer2", WIDTH_ARRAY[2], h, "0 0 400 500", "chartArea2", TRANS_WIDTH[2], TRANS_HEIGHT[2]);
        this.vis[3] = createSvg("#svgcontainer3", WIDTH_ARRAY[3], h, "0 0 400 500", "chartArea3", TRANS_WIDTH[3], TRANS_HEIGHT[3]);

        /* area */
        this.vis[4] = createSvg("#svgcontainer4", WIDTH_ARRAY[4], h, "0 0 400 500", "chartArea4", TRANS_WIDTH[4], TRANS_HEIGHT[4]);
        this.vis[5] = createSvg("#svgcontainer5", WIDTH_ARRAY[5], h, "0 0 400 500", "chartArea5", TRANS_WIDTH[5], TRANS_HEIGHT[5]);
        this.vis[6] = createSvg("#svgcontainer6", WIDTH_ARRAY[6], h, "0 0 400 500", "chartArea6", TRANS_WIDTH[6], TRANS_HEIGHT[6]);

        /* gender */
        this.vis[7] = createSvg("#svgcontainer7", WIDTH_ARRAY[7], h, "0 0 600 500", "chartArea7", TRANS_WIDTH[7], TRANS_HEIGHT[7]);
        this.vis[8] = createSvg("#svgcontainer8", WIDTH_ARRAY[8], h, "0 0 600 500", "chartArea8", TRANS_WIDTH[8], TRANS_HEIGHT[8]);
    }

    // Common layout creator to reduce duplication
    _createLayout(size) {
        const layout = d3.layout.cloud()
            .timeInterval(Infinity)
            .size(size)
            .fontSize((d) => this.fontSizeScale(+d.value))
            .text((d) => d.key)
            .on("end", (data, bounds) => this._draw(data, bounds));

        layout.font('YuGothic').spiral('archimedean');
        return layout;
    }

    initViewport() {
        const w = DIMENSIONS.width;
        const h = DIMENSIONS.height;

        this.layouts.full = this._createLayout([w, h]);
        this.layouts.half = this._createLayout([w / 2, h]);
        this.layouts.third = this._createLayout([w / 3, h]);

        this.fontSizeScale.domain([10, 255]);
    }

    startDrawing(tagsData) {
        this.tagsData = tagsData; // Store references to all tags
        // Logic from drawControll
        // Start drawing sequence
        this.vid = 1; // Reset to start processing from index 1 (age groups etc, index 0 is 'all' handled separately in drawWhole)
        this.processNextLayout();
    }

    processNextLayout() {
        // Determines which layout to use based on vid
        let currentLayout;
        if (this.vid === 0) {
            currentLayout = this.layouts.full;
        } else if (this.vid === 7 || this.vid === 8) {
            currentLayout = this.layouts.half;
        } else {
            currentLayout = this.layouts.third;
        }

        if (this.tagsData[this.vid]) {
            currentLayout.stop().words(this.tagsData[this.vid]).start();
        }
    }

    // Core draw logic (internal)
    _draw(data, bounds) {
        const currentVis = this.vis[this.vid];
        const _width = WIDTH_ARRAY[this.vid];
        const h = DIMENSIONS.height;

        currentVis.attr("width", _width).attr("height", h);

        // Scaling calculation kept from original
        const _scale = bounds ? Math.min(
            _width / Math.abs(bounds[1].x - _width / 2),
            _width / Math.abs(bounds[0].x - _width / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

        const text = currentVis.selectAll("text")
            .data(data, (d) => d.text.toLowerCase());

        // Update existing
        text.transition()
            .duration(1000)
            .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .style("font-size", (d) => d.size + "px");

        // Enter new
        text.enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .style("font-size", (d) => d.size + "px")
            .transition()
            .duration(1000);

        // Common styling
        text.style("fill", (d) => this.grayScale(+d.value))
            .style("opacity", 1.0)
            .style("text-shadow", "1px 1px 0 #888")
            .attr("class", "onetext")
            .attr("id", (d, i) => d.text + this.vid + i)
            .text((d) => d.text);

        // Event listeners
        const self = this;
        text.on("mouseover", function (d, i) { self._handleMouseOver(this, d, i); })
            .on("mouseout", function (d, i) { self._handleMouseOut(this, d, i); })
            .on("click", function (d, i) { self._handleClick(this, d, i); });

        // Advance to next chart
        this.vid++;
        if (this.vid < 9) {
            this.processNextLayout();
        } else {
            this.eventer.publish('draw:about');
        }
    }

    _handleMouseOver(element, d, i) {
        if (this.letterTapFlag) {
            const _v = this._detectSvgNum(d3.select(element.parentNode.parentNode).attr("id"));
            const targetId = "#" + d.text + _v + i;

            d3.select(targetId)
                .transition().duration(40)
                .style({ fill: '#000000', cursor: 'pointer' });

            this.selectObj = d3.select(targetId);
            this.originalSize = d.size;

            if (!this.hoverToggle) {
                this.hoverToggle = true;
                const $circle = Snap(element); // Assuming Snap is global
                $circle.attr({ "font-size": this.originalSize * 0.8 });
                $circle.animate({ "font-size": this.originalSize * 1.0 }, 1000, mina.elastic);
            }
        }
    }

    _handleMouseOut(element, d, i) {
        if (this.letterTapFlag) {
            const _v = this._detectSvgNum(d3.select(element.parentNode.parentNode).attr("id"));

            d3.select("#" + d.text + _v + i)
                .transition().duration(400)
                .style("fill", (d) => this.grayScale(+d.value));

            this.hoverToggle = false;
        }
    }

    _handleClick(element, d, i) {
        if (this.letterTapFlag) {
            this.letterTapFlag = false;
            const _v = this._detectSvgNum(d3.select(element.parentNode.parentNode).attr("id"));

            d3.select("#" + d.text + _v + i)
                .transition().duration(0)
                .style("fill", "#FFF");

            const selectedWord = d.text;
            const vidId = this._detectSvgNum(d3.select(element.parentNode.parentNode).attr("id"));

            // Get transformation info
            // Note: app.js logic relied on global currentNum from navigation. 
            // We need to either pass currentNum or ask app.js for it. 
            // For now, assuming we can get transformation relative to center.
            // But checking original code: TRANS_WIDTH[currentNum] was used. 
            // We might need to refactor this slightly or pass currentNum in update call.
            // *Wait*: The original code used `currentNum` which tracks the active tab.
            // We will emit an event with the selected word info, and let the App layer handle the UI transitions that require global state?
            // OR, we keep the UI logic here but we need `currentNum`. 

            // Let's emit an event for the click, passing necessary data back to App
            // App.js handles the details of 'show:detail' and UI transitions.

            // However, the animation of the word moving to center happens HERE in original code.
            // Ideally we pass currentNum to this class or method.

            this.eventer.publish('word:clicked', [{
                element: element,
                d: d,
                vidId: vidId,
                i: i
            }]);
        }
    }

    // Draw the "Whole" (first tab) visualization
    drawWhole(allOpenText, nowWidth, nowHeight) {
        if (!this.vis[0]) return;
        const h = DIMENSIONS.height;
        this.vis[0].attr("width", WIDTH_ARRAY[0]).attr("height", h);

        // ... (Implementation of drawWhole text generation from app.js) ...
        // Since drawWhole has a lot of "intro animation" logic (btnStart, etc), 
        // it might be cleaner to keep the specific 'intro' logic in a subclass or keep it simple here.
        // For now, I will implement the basic text rendering.

        const topText = this.vis[0].selectAll(".alltext")
            .data(allOpenText)
            .enter().append("text")
            .attr("class", "alltext")
            .attr("text-anchor", "middle")
            .attr("transform", (d, i) => {
                let _x = (Math.random() * nowWidth) / 2;
                let _y = (Math.random() * nowHeight) / 2;
                if (i % 2 === 0) { _x *= -1; _y *= -1; }
                return "translate(" + _x + "," + _y + ")";
            })
            .style("font-size", (d) => d.size + "px")
            .style("fill", (d) => d3.rgb(d.rgb, d.rgb, d.rgb))
            .style("opacity", 0.0)
            .style("text-shadow", "2px 2px 0 #888")
            .attr("id", (d, i) => d.id + "0" + i); // vidId is 0 here

        // Intro interaction logic would go here or be separated.
        // To save complexity in this step, I'll expose a method to 'setupIntro' that App.js can call,
        // or implement the rest of drawWhole here.
        // Given the request to "Avoid Duplicate", the priority was the layout logic.
        // I will finalize basic drawWhole text and leave the specific "Start Button" logic for App.js or a separate Intro component to keep WordCloud generic?
        // Actually, app.js logic mixes UI (Start Button) with Chart. I'll include the references but perhaps let App.js add the button.
        // *Decision*: I will return the selection 'topText' so App.js can add events if needed, OR handle events here.

        // Adding basic events for Whole view
        const self = this;
        topText.on("mouseover", function (d, i) { self._handleWholeMouseOver(this, d, i); })
            .on("mouseout", function (d, i) { self._handleWholeMouseOut(this, d, i); })
            .on("click", function (d, i) { self._handleWholeClick(this, d, i); });

        return { topText, vis: this.vis[0] };
    }

    _handleWholeMouseOver(element, d, i) {
        if (this.letterTapFlagTop) {
            d3.select(element).transition().duration(40).style({ fill: '#000000', cursor: 'pointer' });
            this.selectObj = d3.select(element);
            this.originalSize = d.size;

            if (!this.hoverToggle) {
                this.hoverToggle = true;
                const $letterEffect = Snap(element);
                $letterEffect.attr({ "font-size": this.originalSize * 0.8 });
                $letterEffect.animate({ "font-size": this.originalSize * 1.0 }, 1000, mina.elastic);
            }
        }
    }

    _handleWholeMouseOut(element, d, i) {
        if (this.letterTapFlagTop) {
            d3.select(element).transition().duration(400).style("fill", d3.rgb(d.rgb, d.rgb, d.rgb));
            this.hoverToggle = false;
        }
    }

    _handleWholeClick(element, d, i) {
        if (this.letterTapFlagTop) {
            this.letterTapFlagTop = false;
            // Animation logic for clicking a word in the main view
            // This is complex and involves moving the word to center.
            // Emitting event to let App.js orchestrate, or logic here.
            this.eventer.publish('word:clicked:whole', [{
                element: element,
                d: d,
                i: i
            }]);
        }
    }

    _detectSvgNum(_string) {
        return parseInt(_string.substr(9, 1));
    }

    // Reset colors for normal views
    resetColors(vidId) {
        if (!this.vis[vidId]) return;
        this.vis[vidId].selectAll("text")
            .transition().duration(1000)
            .style("opacity", 1.0)
            .style("fill", (d) => this.grayScale(+d.value));
    }

    // Reset colors for top view (Whole)
    resetColorsTop() {
        if (!this.vis[0]) return;
        this.vis[0].selectAll("text")
            .transition().duration(1000)
            .style("opacity", 1.0)
            .style("fill", (d) => d3.rgb(d.rgb, d.rgb, d.rgb));
    }

    // Helpers to control visibility from App.js
    setLetterTapFlag(val) { this.letterTapFlag = val; }
    setLetterTapFlagTop(val) { this.letterTapFlagTop = val; }
}
