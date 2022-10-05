/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import './styles';
import AudioRec from './recorder/recorders/audioRec';
import VideoRec from './recorder/recorders/videoRec';

import Upload from '../../../upload/upload';

import engine from '../../../lib/engine/engine';
import recT from './recorder/recorder.tmp';

export default class Media {
    constructor(footer, loadHandler, header) {
        this.upload = new Upload(loadHandler);
        this.handlers = {
            upload: this.uploadData(),
            recreateRec: this.recreateRec(),
            header,
        };

        this.container = footer.querySelector('.media');
        this.audioContainer = footer.querySelector('.recorder__audio');
        this.videoContainer = footer.querySelector('.recorder__video');

        this.audioRec = this.initAudio();
        this.videoRec = this.initVideo();
    }

    initAudio() {
        this.audioRec = new AudioRec(this.audioContainer, this.handlers);
    }

    initVideo() {
        this.videoRec = new VideoRec(this.videoContainer, this.handlers);
    }

    uploadData() {
        return (data) => {
            this.upload.onUpload(data);
        };
    }

    recreateRec() {
        return (container, deleteHandler) => {
            const rec = container.querySelector('.video-js');
            const html = engine(recT(rec.id));

            deleteHandler();

            container.insertAdjacentHTML('afterbegin', html);
            rec.id === 'audio' ? this.initAudio() : this.initVideo();
        };
    }
}
