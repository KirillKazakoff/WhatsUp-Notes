import './footer.css';
import template from '../../lib/engine/template';
import { userTextT } from '../../upload/parseUpload/nodes.tmp';
import { setData } from '../../lib/utils';
import setLinksInText from './footerUtils/linkInText';

import Media from './media/media';

export default class Footer {
    constructor(loadHandler, header) {
        this.loadHandler = loadHandler;

        this.container = document.querySelector('.chat-footer');
        this.button = this.container.querySelector('.footer-badge__record');
        this.input = this.container.querySelector('.record-input');
        this.media = new Media(this.container, loadHandler, header);

        this.mesInput = this.container.querySelector('.input__message');
    }

    sendTextMessage(e) {
        if (e.key === 'Enter') {
            const { value } = this.mesInput;

            if (!value) return;

            const file = new File([value], 'userText.txt', {
                type: 'userText',
            });

            this.prepareAndSend(userTextT, setLinksInText(value), file);
            this.mesInput.value = '';
        }
    }

    prepareAndSend(tmp, param, file) {
        const mesObj = {
            node: template(tmp, param),
            data: setData(file, 'doc'),
        };

        const mesArrObj = {
            messages: [mesObj],
            direction: 'toBottom',
        };

        this.loadHandler(mesArrObj);
    }
}
