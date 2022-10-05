/* eslint-disable import/no-extraneous-dependencies */
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';

import 'videojs-wavesurfer/dist/videojs.wavesurfer';
import videojs from 'video.js';
import 'videojs-record/dist/videojs.record';

import 'videojs-record/dist/plugins/videojs.record.libvorbis';

import MyRecorder from '../myRecorder';

WaveSurfer.microphone = MicrophonePlugin;

export default class AudioRec {
    constructor(container, handler) {
        this.container = container;
        this.initOptions();

        this.player = videojs('audio', this.options);
        this.recorder = new MyRecorder(this.player, container, handler);
    }

    initOptions() {
        this.options = {
            controls: true,
            bigPlayButton: false,
            controlBar: {
                fullscreenToggle: false,
                volumePanel: false,
                deviceButton: false,
                timeDivider: false,
                durationDisplay: false,
                liveDisplay: false,
                seekToLive: false,
            },
            width: 0,
            height: 0,
            plugins: {
                wavesurfer: {
                    backend: 'WebAudio',
                    waveColor: 'black',
                    cursorWidth: 0,
                    interact: false,
                    hideScrollbar: true,
                    plugins: [
                        WaveSurfer.microphone.create({
                            bufferSize: 4096,
                            numberOfInputChannels: 1,
                            numberOfOutputChannels: 1,
                        }),
                    ],
                },
                record: {
                    audio: true,
                    video: false,
                    maxLength: 5,
                },
            },
        };
    }
}
