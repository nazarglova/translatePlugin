function init() {
    let items = [{
        text: 'item 1',
        link: '#'
    }, {
        text: 'item 2',
        link: '#'
    }, {
        text: 'item 3',
        link: '#'
    }];

    let translator = new Translator(items);
    translator.init();
}

document.addEventListener('DOMContentLoaded', init, false);