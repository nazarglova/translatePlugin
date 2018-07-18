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

    let translatorInContextMenu = new TranslatorInContextMenu(items);
    translatorInContextMenu.init();
}

document.addEventListener('DOMContentLoaded', init, false);