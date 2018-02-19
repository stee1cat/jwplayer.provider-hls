import { ISource } from './provider';

export function isSupportSrc(src: ISource): boolean {
    if (src.type === 'hls') {
        return true;
    }

    return !!(src.file || '').match(/\.m3u8$/);
}

export function formatLevelLabel(level) {
    if (level.height) {
        return level.height + 'p';
    }

    if (level.width) {
        return Math.round(level.width * 9 / 16) + 'p';
    }

    // if (level.bitrate) {
    //     return scaled_number(level.bitrate) + 'bps';
    // }

    return 0;
}
