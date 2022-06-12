import fs from 'fs';
import ytld from 'ytdl-core';

export default function download(url, pathFile, option) {
    return new Promise((resolve, reject) => {
        try {         
            const video = ytld(url);
            const fstream = fs.createWriteStream(pathFile);
            let starttime;
            
            fstream.on('error', function(err) {
                console.log(`Error: ${err}, Url: ${url}`);
                video.unpipe();
                fstream.end();
                resolve(`Error: ${err}`);
            });
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
                process.stdout.write('\n');
            });
            video.pipe(fstream);
            if (fs.existsSync(pathFile)) {
                resolve(`File created! in ${pathFile}`);
            }
        } catch (error) {
            reject(error);
            throw error;
        }

    })
}