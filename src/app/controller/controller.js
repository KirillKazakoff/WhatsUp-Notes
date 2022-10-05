/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import Content from '../components/content/content';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import ServerLoad from '../upload/serverLoad/serverLoad';

export default class Controller {
    constructor() {
        const uploadH = this.uploadRenderH();

        this.serverLoad = new ServerLoad(uploadH);

        const { downloadOnScrollH, downloadOnFilterH } = this.serverLoad;

        this.content = new Content(uploadH, downloadOnScrollH);

        const cancelFilterH = this.content.cancelFilter();
        const scrollBlockH = this.content.scroll.setBlock();

        this.header = new Header(uploadH, downloadOnFilterH, cancelFilterH, scrollBlockH);
        this.footer = new Footer(uploadH, this.header);

        this.container = document.querySelector('.chat');
        this.container.addEventListener('submit', (e) => this.onSubmit(e));

        document.addEventListener('keydown', (e) => {
            if (this.header.isFilter) return;
            this.footer.sendTextMessage(e);
        });
    }

    onSubmit(e) {
        e.preventDefault();
    }

    uploadRenderH() {
        return (mesArr) => {
            if (!this.header.isFilter) {
                if (!mesArr) return;

                mesArr.messages.forEach((mesObj) => {
                    if (mesObj.data.file) {
                        this.serverLoad.uploadToServ(mesObj.data);
                    }
                });
                this.content.addMessages(mesArr);
            } else {
                this.content.scroll.block = true;
                this.content.filterMessages(mesArr);
            }
        };
    }
}
