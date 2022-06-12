import fs, { existsSync, mkdir } from 'fs';
import path from 'path';
import ytld from 'ytdl-core';
import { messageJson } from '../config/format.js';

export default function download(url, pathFile, option) {
    return new Promise((resolve, reject) => {
        try {         
            const video = ytld(url);
        
            let starttime;
            video.once('response', () => {
                starttime = Date.now();
            });
            video.on('progress', (chunkLength, downloaded, total) => {
                const percent = downloaded / total;
                const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
                const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
                if ((percent * 100) == 100) {
                    console.log(`${(percent * 100).toFixed(2)}% downloaded`, `${estimatedDownloadTime.toPrecision(2)} estimed finished`);                    
                }
            });
            video.on('end', () => {
                process.stdout.write('\n\n');
            });
            video.pipe(fs.createWriteStream(pathFile));
            if (fs.existsSync(pathFile)) {
                resolve(messageJson(`File created! in ${pathFile}`));
            }
        } catch (error) {
            reject(error);
        }

    })
}