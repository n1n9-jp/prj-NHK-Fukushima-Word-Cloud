export default class DataStore {
    constructor() {
        this.tags = [];
        this.allOpenText = [];
        this.detailWordsArray = [];
    }

    /**
     * Set loaded data
     */
    setData(tags, allOpenText, detailWordsArray) {
        this.tags = tags;
        this.allOpenText = allOpenText;
        this.detailWordsArray = detailWordsArray;
    }

    /**
     * Get tags for drawing
     */
    getTags() {
        return this.tags;
    }

    /**
     * Get all open text for the introduction/whole view
     */
    getAllOpenText() {
        return this.allOpenText;
    }

    /**
     * Find details for a specific word
     * @param {String} word - The selected word
     * @param {Number} viewIndex - Current view index (0=All, 1-8=Categories)
     * @returns {Array|Object} - Returns found details. 
     * If viewIndex is 0, returns an array of details across all categories.
     * If viewIndex > 0, returns specific detail object (or null if not found).
     */
    findDetails(word, viewIndex) {
        if (!this.detailWordsArray || this.detailWordsArray.length === 0) return null;

        if (viewIndex === 0) {
            // "Whole" view logic: search across all categories (1-8)
            const results = [];
            // Category 0 in detailWordsArray seems to be "all"? app.js logic iterates j=1 to 8.
            // But app.js also had a fallback to check detailWordsArray[0].

            // Let's replicate app.js logic for 'whole':
            // It iterates j=1 to 8, finds matching word, extracts data, and builds HTML string.
            // Ideally DataStore should return DATA, not HTML.

            for (let j = 1; j < 9; j++) {
                if (!this.detailWordsArray[j]) continue;
                for (let i = 0; i < this.detailWordsArray[j].length; i++) {
                    const item = this.detailWordsArray[j][i];
                    if (item && item.keyword === word) {
                        results.push(item);
                        // app.js loop doesn't break? It seems it constructs 'wholeVoice' by concatenating.
                        // However, usually one word matches one entry per category? 
                        // Or can a word appear multiple times? 
                        // The original code:
                        // for(var i=0...){ if(match){ set _age, _sex... } }
                        // It overrides variables in the inner loop. So effectively it takes the LAST match in that category?
                        // That seems like a bug or specific data structure behavior in original code.
                        // Verify: `_age = ...` is simple assignment.
                        // So for each category j, it finds the last occurrence of the word.
                    }
                }
            }

            // Check fallback to index 0 if results is empty?
            // Original code: if (wholeVoice == "") { loop detailWordsArray[0] ... }
            if (results.length === 0 && this.detailWordsArray[0]) {
                for (let k = 0; k < this.detailWordsArray[0].length; k++) {
                    const item = this.detailWordsArray[0][k];
                    if (item && item.keyword === word) {
                        results.push(item);
                        // Again, original code assignment overrides. 
                        // But if we push to array, we might get multiple.
                        // Let's stick to returning array of matches.
                    }
                }
            }
            return { type: 'multiple', data: results };

        } else {
            // Specific category view
            // Original code loops through detailWordsArray[currentNum] (vidId)
            if (!this.detailWordsArray[viewIndex]) return null;

            let match = null;
            const categoryData = this.detailWordsArray[viewIndex];

            for (let i = 0; i < categoryData.length; i++) {
                if (categoryData[i].keyword === word) {
                    match = categoryData[i];
                    // Again, original code assignment overrides, implying last match wins.
                }
            }

            return { type: 'single', data: match };
        }
    }
}
