import { ISource } from './provider';

export function isSupportSrc(src: ISource): boolean {
    if (src.type === 'hls') {
        return true;
    }

    return !!(src.file || '').match(/\.m3u8$/);
}