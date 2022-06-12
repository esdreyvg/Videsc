import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

export function pathOptions(params) {       
    //const __dirname = process.env.HOMEPATH; //Para Produccion
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.join(path.dirname(__filename), '..');
    const directory = path.join(__dirname, '/VIDESC_YOUTUBE/');
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }
    const file = directory + params + '.mp4';
    return file;
}

export default function downloadOptions(cookies, proxy) {

    return {
        filter: format => format.container === 'mp4',
        requestOptions: {
            headers: {
              cookie: cookies,
            },
            agent: proxy
        },
    };
}