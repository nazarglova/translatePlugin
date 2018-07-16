class Translator {
	constructor() {
		this.menuData = null;
	}

	init() {
		window.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			this.showMenu(event);
		});
		document.addEventListener('mousedown', (event) => {
			if (this.menuData && event.which != 3) {
				const {pageX, pageY} = event;
				const {clientWidth: width, clientHeight: height} = this.menuData.template;
				const {pageX: x, pageY: y} = this.menuData;
				if (!(pageX > x && pageX < x + width && pageY > y && pageY < y + height)) {
					this.removeMenu();
				}
			}
		});
	}

	_getMenuTemplate() {
		const selectedText = this.getSelectedText();
		let template = ``;
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
		if (selectedText) {
			const link = `https://translate.google.com.ua/#en/uk/${selectedText.replace(' ', '%20')}`;
			items.push({text: `Translate: ${selectedText}`, link})
		}
		items.forEach(el => {
			template += `<li><a target="_blank" href="${el['link']}">${el['text']}</a></li>`
		});

		return `<ul style="display:inline-block;">${template}</ul>`;
	}

	_createMenu(pageX, pageY) {
		if (this.menuData) this.removeMenu();
		let template = document.createElement("div");
		template.setAttribute("id", "menuTemplate");
		template.style = `position:fixed;
							top: ${pageY}px;
							left: ${pageX}px;
							padding: 0 10px;
							color: red;
							background: yellow;`;
		template.innerHTML = this._getMenuTemplate();
		this.menuData = {template, pageX, pageY};
	}

	showMenu(event) {
		this._createMenu(event.pageX, event.pageY);
		document.body.appendChild(this.menuData['template']);
	}

	removeMenu() {
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
let transl = new Translator;
transl.init();
