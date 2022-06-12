import fs, { existsSync, mkdir } from 'fs';
import path from 'path';
import ytld from 'ytdl-core';
import { messageJson } from '../config/format.js';

export default function download(url, title, option) {
    const __dirname = process.env.HOMEPATH;
    const directory = path.join(__dirname, '/VIDESC_YOUTUBE');
    if (!existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    return new Promise((resolve, reject) => {
        try {            
            const file = directory + title + '.mp4';
            const video = ytld(url);
        
            let starttime;
            video.once('response', () => {
                starttime = Date.now();
            });
            video.on('progress', (chunkLength, downloaded, total) => {
                const percent = downloaded / total;
                const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
                const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
                //readline.cursorTo(process.stdout, 0);
                process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
                process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
                process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
                process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
                //readline.moveCursor(process.stdout, 0, -1);
            });
            video.on('end', () => {
                process.stdout.write('\n\n');
            });
            video.pipe(fs.createWriteStream(file));
            if (existsSync(file)) {
                resolve(messageJson('File created!'));
            }
        } catch (error) {
            reject(error);
        }

    })
}