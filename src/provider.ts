import Hls from 'hls.js';

import { isSupportSrc } from './util';

export interface ISource {
    type: string;
    file: string;
}

export default class Provider {

    public static getName() {
        return {
            name: 'stee1cat/hls'
        };
    }

    public static attach() {
        let jwplayer = window.jwplayer;

        if (Provider.disabled) {
            Provider.disabled = false;

            jwplayer.api.registerProvider(Provider);
        }
    }

    public static detach(provider) {
        Provider.disabled = true;

        if (!provider || !provider.attached) {
            return;
        }
    }

    public static supports(src: ISource): boolean {
        return !Provider.disabled && isSupportSrc(src) && Hls.isSupported();
    }

    protected static disabled: boolean = true;
    protected player: any;
    protected attached = false;
    protected element: HTMLElement;
    protected video: HTMLVideoElement;
    protected hls: Hls;

    constructor(id) {
        this.player = window.jwplayer(id);

        this.element = document.getElementById(id);
        this.video = this.element ? this.element.querySelector('video') : undefined;

        if (!this.video) {
            this.video = document.createElement('video');
        }

        this.video.className = 'jw-video jw-reset';

        this.hls = new Hls({});

        if (this.player) {
            this.player.provider = this;
            this.player.hls = this.hls;
        }
    }

    public init() {
        // nope
    }

}

window.hlsProvider = Provider;
