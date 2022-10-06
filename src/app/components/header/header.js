import './header.css';
import Upload from '../../upload/upload';
import info from '../info/info';

export default class Header {
    constructor(uploadH, downloadOnFilterH, cancelFilterH, setScrollBlockH) {
        this.isFirstSearch = true;
        this.isFilter = false;
        this.cancelFilterH = cancelFilterH;
        this.setScrollBlockH = setScrollBlockH;

        this.container = document.querySelector('.header');
        this.pinBtn = this.container.querySelector('.header-badge__pin');
        this.pinInput = this.container.querySelector('.input__file');
        this.help = this.container.querySelector('.header-badge__help');

        this.search = this.container.querySelector('.header-badge__search');
        this.searchInput = this.container.querySelector('.input__search');
        this.upload = new Upload(uploadH, this.pinInput, null);
        this.downloadOnFilterH = downloadOnFilterH;

        this.search.addEventListener('click', (e) => this.onSearch(e));
        this.searchInput.addEventListener('input', (e) => this.onInput(e));
        this.pinBtn.addEventListener('click', (e) => this.upload.onClick(e));
        this.help.addEventListener('click', () => info.renderInfo(info.messages.search.title, info.messages.search.desc));
    }

    onSearch() {
        if (this.isFirstSearch) {
            info.renderInfo(info.messages.search.title, info.messages.search.desc);
            this.isFirstSearch = false;
        }

        this.setScrollBlockH();
        this.isFilter = !this.isFilter;
        this.searchInput.classList.toggle('hidden');

        if (!this.isFilter) {
            this.cancelFilterH();
            this.searchInput.value = '';
        }
    }

    onInput() {
        const { value } = this.searchInput;

        if (!value) {
            this.downloadOnFilterH('top', 'all');
            return;
        }

        this.downloadOnFilterH('top', value);
    }
}
