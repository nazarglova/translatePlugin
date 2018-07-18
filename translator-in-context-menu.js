class TranslatorInContextMenu {
    constructor(items) {
        this.items = items;
        this.menuData = null;
        this._translateItemTemplate = null;
        this.menuIsShown = false;
    }

    init() {
        this.menuData = {template: this._generateMenuTemplate()};
        this._createEventListeners();
    }

    _createEventListeners() {
        window.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.showMenu(event);
        });
        document.addEventListener('click', (event) => {
            if (!this.menuData && event.which == 3) return;
            this.hideMenu();
        });
    }

    _generateMenuTemplate() {
        let items = this.items.slice();
        let menuBox = document.createElement('UL');
        menuBox.style = `position:fixed;
						 margin:0;
						 padding: 5px 10px;
						 list-style: none;
						 background: yellow;`;
        items.forEach(el => menuBox.appendChild(this._generateMenuItem(el)));
        return menuBox;
    }

    _generateMenuItem(el, target) {
        const itemTemplate = document.createElement('LI');
        const linkTemplate = document.createElement('A');
        const text = document.createTextNode(el['text']);

        linkTemplate.setAttribute('href', el['link']);
        if (target) linkTemplate.setAttribute('target', target);
        linkTemplate.appendChild(text);
        itemTemplate.appendChild(linkTemplate);
        return itemTemplate;
    }

    _generateTranslateMenuItem(selectedText) {
        if (!selectedText) return;
        const siteLink = 'https://translate.google.com.ua/#en/uk/';
        const link = `${siteLink}${selectedText.replace(' ', '%20')}`;
        return this._generateMenuItem({text: `Translate`, link}, '_blank');
    }

    _toggleTranslateMenuItem() {
        const selectedText = this.getSelectedText().trim();
        const {template} = this.menuData;

        if (selectedText && !template.contains(this._translateItemTemplate)) {
            this._translateItemTemplate = this._generateTranslateMenuItem(selectedText);
            template.appendChild(this._translateItemTemplate);
        } else if (!selectedText && template.contains(this._translateItemTemplate)) {
            template.removeChild(this._translateItemTemplate);
            this._translateItemTemplate = null;
        }
    }

    showMenu(event) {
        const {pageX, pageY} = event;
        const {template} = this.menuData;
        this._toggleTranslateMenuItem();

        template.style.top = pageY + 'px';
        template.style.left = pageX + 'px';

        document.body.appendChild(this.menuData['template']);
        this.menuIsShown = true;
    }

    hideMenu() {
        if (!this.menuIsShown) return;
        const {template} = this.menuData;

        this.menuIsShown = false;
        document.body.removeChild(template);

        if (!this._translateItemTemplate) return;
        template.removeChild(this._translateItemTemplate);
        this._translateItemTemplate = null;
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
