import fs, { existsSync, mkdir } from 'fs';
import path from 'path';
import ytld from 'ytdl-core';
import { messageJson } from '../config/format.js';

export default function download(url, title, option) {
    return new Promise((resolve, reject) => {
        try {            
            const __dirname = process.env.HOMEPATH;
            const directory = path.join(__dirname, '/Downloads/VIDESC_YOUTUBE/');
            if (!existsSync(directory)) {
                fs.mkdirSync(directory, {recursive: true});
            }
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
                
                console.log(`${(percent * 100).toFixed(2)}% downloaded`, `${estimatedDownloadTime.toPrecision(2)} estimed finished`);
            });
            video.on('end', () => {
                process.stdout.write('\n\n');
            });
            video.pipe(fs.createWriteStream(file));
            if (fs.existsSync(file)) {
                resolve(messageJson(`File created! in ${file}`));
            }
        } catch (error) {
            reject(error);
        }

    })
}