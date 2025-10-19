import { Request } from 'express';

export function resolveBaseUrl(req: Request): string {
    const fromEnv = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
    if (fromEnv) {
        return fromEnv;
    }

    const host = req.get('host');
    if (host) {
        return `${req.protocol}://${host}`;
    }

    return 'http://localhost:3333';
}
