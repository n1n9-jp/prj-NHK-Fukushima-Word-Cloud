export default class DetailView {

    _getAreaText(areaCode) {
        const area = parseInt(areaCode);
        switch (area) {
            case 1:
            case 2:
                return "帰還困難区域";
            case 3:
                return "居住制限区域";
            case 4:
                return "避難指示解除準備区域";
            default:
                return "";
        }
    }

    createContentSingle(data) {
        if (!data) return null;

        let _age = data.age || "";
        const _sex = data.sex || "";
        const _areaText = this._getAreaText(data.area);
        const _expression = data.expression || "";

        if (_age !== "") {
            _age += '歳 ';
        }

        return {
            title: '避難者の声' + '<div class="attr age">' + _sex + ' ' + _age + _areatext + '</div>',
            content: '<div class="attr area">' + _expression + '</div>'
        };
    }

    generateModalOptions(searchResult, word) {
        let title = '避難者の声';
        let content = '';
        const buttons = [{ label: '閉じる' }];

        if (!searchResult || !searchResult.data) {
            return { title, content: 'データが見つかりませんでした。', buttons };
        }

        if (searchResult.type === 'multiple') {
            // 'Whole' view: display list of voices
            let wholeVoice = "";
            const items = searchResult.data;

            items.forEach(item => {
                let _age = item.age || "";
                const _sex = item.sex || "";
                const _areaText = this._getAreaText(item.area);
                const _expression = item.expression || "";

                if (_age !== "") {
                    _age += '歳 ';
                    // Note: Check original code logic.
                    // It appended HTML string:
                    // wholeVoice += '<div class="attr age">' + _sex + ' ' + _age + _areaText + '</div>' + '<div class="attr area">' + _expression + '</div>';
                }

                // Original code had `if(!_age == "")` check before appending. 
                // Wait, original: `if (!_age == "")` -> `if (_age != "")`
                if (_age !== "" || (item.age && item.age !== "")) {
                    wholeVoice += '<div class="attr age">' + _sex + ' ' + _age + _areaText + '</div>' + '<div class="attr area">' + _expression + '</div>';
                }
            });

            content = wholeVoice;

        } else if (searchResult.type === 'single') {
            const item = searchResult.data;
            if (!item) return { title, content: '詳細データがありません。', buttons };

            let _age = item.age || "";
            const _sex = item.sex || "";
            const _areaText = this._getAreaText(item.area);
            const _expression = item.expression || "";

            if (_age !== "") {
                _age += '歳 ';
            }

            title = '避難者の声' + '<div class="attr age">' + _sex + ' ' + _age + _areaText + '</div>';
            content = '<div class="attr area">' + _expression + '</div>';
        }

        return { title, content, buttons };
    }
}
