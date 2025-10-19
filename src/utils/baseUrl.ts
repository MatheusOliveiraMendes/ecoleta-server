import { Request } from 'express';

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

export function resolveBaseUrl(req: Request): string {
    const fromEnv = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
    if (fromEnv) {
        return stripTrailingSlash(fromEnv);
    }

    const host = req.get('host');
    if (host) {
        return stripTrailingSlash(`${req.protocol}://${host}`);
    }

    return 'http://localhost:3333';
}

export function resolveAssetsBaseUrl(req: Request): string {
    const fromEnv = process.env.ASSETS_BASE_URL;
    if (fromEnv) {
        return stripTrailingSlash(fromEnv);
    }

    return `${resolveBaseUrl(req)}/uploads`;
}
