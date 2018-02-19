import * as EventEmitter from 'eventemitter3';
import Hls from 'hls.js';

import { JWPlayerEvents } from './events';
import { formatLevelLabel, isSupportSrc } from './util';

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
    protected container: HTMLElement;
    protected video: HTMLVideoElement;
    protected hls: Hls;
    protected eventEmitter: EventEmitter;

    constructor(id) {
        this.player = window.jwplayer(id);

        this.element = document.getElementById(id);
        this.video = this.element ? this.element.querySelector('video') : undefined;

        if (!this.video) {
            this.video = document.createElement('video');
        }

        this.video.className = 'jw-video jw-reset';

        if (this.player) {
            let config = this.player.getConfig();
            let hlsConfig = config.hlsjsConfig || {};

            this.hls = new Hls(hlsConfig);
            this.player.provider = this;
            this.player.hls = this.hls;

            this.hls.on(Hls.Events.MANIFEST_LOADED, this.onManifestLoaded.bind(this));
        }

        this.eventEmitter = new EventEmitter();
    }

    public init() {
        this.video.setAttribute('jw-loaded', 'init');
    }

    public load(item) {
        if (Provider.disabled) {
            return;
        }

        let source = (item.sources.find(s => s.default) || item.sources[0]).file;

        this.video.load();
        this.hls.loadSource(source);

        if (!this.attached) {
            this.attachMedia();
        }
    }

    public play() {
        this.video.play();
    }

    public attachMedia() {
        this.attached = true;
        this.hls.attachMedia(this.video);
    }

    public detachMedia() {
        this.attached = false;
    }

    public on(event: string, listener: EventEmitter.ListenerFn) {
        this.eventEmitter.on(event, listener);
    }

    public off(event: string, listener: EventEmitter.ListenerFn) {
        this.eventEmitter.off(event, listener);
    }

    public trigger(event, ...args) {
        if (!this.attached) {
            return;
        }

        this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args]);

        if (event !== 'all') {
            args.unshift('all');

            this.eventEmitter.emit.apply(this.eventEmitter, [event, ...args]);
        }
    }

    public setContainer(element: HTMLElement) {
        this.container = element;
        this.container.appendChild(this.video);
    }

    protected onManifestLoaded() {
        let levels = this.hls.levels;

        this.trigger(JWPlayerEvents.JWPLAYER_MEDIA_LEVELS, {
            currentQuality: this.getCurrentLevel().jw,
            levels: this.getLevels()
        });

        if (!levels) {
            return;
        }

        this.trigger(JWPlayerEvents.JWPLAYER_MEDIA_TYPE, {
            mediaType: this.isVideo(levels) ? 'video' : 'audio'
        });
    }

    protected isVideo(levels): boolean {
        let isVideo: number = 0;

        levels.forEach(level => {
            isVideo += +!!(level.videoCodec || !level.audioCodec &&
                (level.bitrate > 64000 || level.width || level.height));
        });

        return !!isVideo;
    }

    protected getCurrentLevel(level?: number) {
        let levels = this.hls.levels || [];

        level = level || this.hls.currentLevel;

        return {
            jw: this.hls.manual_level === -1 || levels.length < 2 ? 0 : level + 1,
            real: levels.length < 2 ? 0 : level + 1
        };
    }

    protected getLevels() {
        let levels = this.hls.levels || [];
        let result = [];

        if (levels.length > 1) {
            result.push({
                label: 'Auto'
            });
        }

        levels.forEach(level => {
            result.push({
                bitrate: level.bitrate,
                height: level.height,
                label: formatLevelLabel(level),
                width: level.width
            });
        });

        return result;
    }

}

window.hlsProvider = Provider;
