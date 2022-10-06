import Display from './display';

export default class MyRecorder {
    constructor(player, container, handlers) {
        this.handlers = handlers;
        this.display = new Display(container);

        this.player = player;
        this.record = this.player.record();

        this.dataRec = null;

        this.player.on('finishRecord', () => this.onFinishRec());

        this.onRecord = this.onRecord.bind(this);
        this.display.recordBtn.addEventListener('click', this.onRecord);

        this.onCancel = this.onCancel.bind(this);
        this.onSend = this.onSend.bind(this);

        this.display.cancelBtn.addEventListener('click', this.onCancel);
        this.display.sendBtn.addEventListener('click', this.onSend);
    }

    async onRecord() {
        if (this.handlers.header.isFilter) {
            return;
        }
        this.display.recordBtn.removeEventListener('click', this.onRecord);
        const promise = new Promise((resolve) => {
            this.player.on('deviceReady', () => resolve());
        });

        this.record.getDevice();
        await promise;

        this.display.showRecContainer();
        this.record.start();
    }

    onFinishRec() {
        this.dataRec = {
            target: {
                files: [this.player.recordedData],
            },
        };

        this.display.hideDisplay();
        this.record.stop();
        this.record.reset();
    }

    onForceFinishRec() {
        this.player.off();

        const finishRecHandler = (resolve) => {
            const handler = () => {
                this.onFinishRec();

                resolve();
            };

            return handler;
        };

        return new Promise((resolve) => {
            this.player.on('finishRecord', finishRecHandler(resolve));
        });
    }

    async stop() {
        this.record.stop();
        await this.onForceFinishRec();
    }

    async back() {
        if (this.record.isRecording()) {
            await this.stop();
        }
        this.display.cancelBtn.removeEventListener('click', this.onCancel);
        this.display.sendBtn.removeEventListener('click', this.onSend);
    }

    async onCancel() {
        await this.back();

        this.handlers.recreateRec(this.display.recordContainer, () => {
            this.recreateCallback();
        });
    }

    async onSend() {
        await this.back();

        this.handlers.upload(this.dataRec);

        this.handlers.recreateRec(this.display.recordContainer, () => {
            this.recreateCallback();
        });
    }

    recreateCallback() {
        this.player.reset();
        this.player.dispose();
        this.display.hideRecContainer();
    }
}
