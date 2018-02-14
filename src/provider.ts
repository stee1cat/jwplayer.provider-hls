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

    protected static disabled: boolean = false;
    protected jwplayer: any;
    protected attached = true;

    constructor(id) {
        this.jwplayer = window.jwplayer;
    }

}

window.hlsProvider = Provider;
