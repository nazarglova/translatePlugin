class Translator {
    constructor(items) {
        this.menuData = null;
        this.items = items;
        this.translateItemTemplate = null;
        this.menuIsShown = false;
    }

    init() {
        this.menuData = {template: this.generateMenuTemplate()};
        this.createContextMenuEventListener();
        document.addEventListener('click', (event) => {
            if (!this.menuData && event.which == 3) return;
            this.hideMenu();
            // this.hideMenuOnClickOutside(event.pageX, event.pageY);
        });

        // window.addEventListener('keyup', (event) => {
        //     event.preventDefault();
        //     this.newShowMenu(event);
        // });
    }

    createContextMenuEventListener() {
        window.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.newShowMenu(event);
        });
    }

    _getMenuTemplate() {
        let template = ``;
        let items = this.items.slice();

        const selectedText = this.getSelectedText();

        if (selectedText) {
            const link = `https://translate.google.com.ua/#en/uk/${selectedText.replace(' ', '%20')}`;
            items.push({text: `Translate`, link})
        }
        items.forEach(el => {
            template += `<li><a target="_blank" href="${el['link']}">${el['text']}</a></li>`
        });

        return `<ul style="margin: 0;padding: 5px 10px;list-style: none;">${template}</ul>`;
    }

    generateMenuTemplate() {
        let items = this.items.slice();
        let menuBox = document.createElement('UL');
        items.forEach(el => menuBox.appendChild(this.generateMenuItem(el)));
        return menuBox;
    }

    generateMenuItem(el, target) {
        const itemTemplate = document.createElement('LI');
        const linkTemplate = document.createElement('A');
        const text = document.createTextNode(el['text']);

        linkTemplate.setAttribute('href', el['link']);
        if (target) linkTemplate.setAttribute('target', target);
        linkTemplate.appendChild(text);
        itemTemplate.appendChild(linkTemplate);
        return itemTemplate;
    }

    generateTranslateMenuItem(selectedText) {
        if (!selectedText) return;
        const siteLink = 'https://translate.google.com.ua/#en/uk/';
        const link = `${siteLink}${selectedText.replace(' ', '%20')}`;
        return this.generateMenuItem({text: `Translate`, link}, '_blank');
    }

    toggleTranslateMenuItem() {
        const selectedText = this.getSelectedText();
        const {template} = this.menuData;
        if (selectedText && !template.contains(this.translateItemTemplate)) {
            this.translateItemTemplate = this.generateTranslateMenuItem(selectedText);
            template.appendChild(this.translateItemTemplate);
        } else if (!selectedText && template.contains(this.translateItemTemplate)) {
            template.removeChild(this.translateItemTemplate);
            this.translateItemTemplate = null;
        }
    }


    _createMenu(pageX, pageY) {
        if (this.menuData) this._removeMenu();
        let template = document.createElement("div");
        template.style = `position:fixed;
							top: ${pageY}px;
							left: ${pageX}px;
							padding: 0 10px;
							color: red;
							background: yellow;`;
        template.innerHTML = this._getMenuTemplate();
        this.menuData = {template, pageX, pageY};
    }

    newShowMenu(event) {
        const {pageX, pageY} = event;
        this.toggleTranslateMenuItem();
        this.menuData = Object.assign({}, this.menuData, {pageX, pageY});
        const {template} = this.menuData;
        
        document.body.appendChild(this.menuData['template']);
        this.menuIsShown = true;
    }

    hideMenu() {
        if (!this.menuIsShown) return;
        const {template} = this.menuData;
        document.body.removeChild(template);
        if (template.contains(this.translateItemTemplate)) {
            template.removeChild(this.translateItemTemplate);
        }
        if (this.translateItemTemplate) this.translateItemTemplate = null;
        this.menuIsShown = false;
    }

    showMenu(event) {
        this._createMenu(event.pageX, event.pageY);
        document.body.appendChild(this.menuData['template']);
    }

    hideMenuOnClickOutside(pageX, pageY) {
        const {clientWidth: width, clientHeight: height} = this.menuData.template;
        const {pageX: x, pageY: y} = this.menuData;
        if (pageX > x && pageX < x + width && pageY > y && pageY < y + height) return;
        this._removeMenu();
    }


    _removeMenu() {
        document.body.removeChild(this.menuData['template']);
        this.menuData = null;
    }


    getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return;
    }
}

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

function init() {
    let transl = new Translator(items);
    transl.init()
}

document.addEventListener('DOMContentLoaded', init, false);
