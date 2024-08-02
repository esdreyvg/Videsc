import fs from 'fs';
import path from 'path';
import ytld from 'ytdl-core';

export function download(url, pathFile, option) {
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

export function youtube(url, downloadPath) {
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar si la ruta de descarga existe, si no, crearla
            if (!fs.existsSync(downloadPath)) {
                fs.mkdirSync(downloadPath, { recursive: true });
            }
            const info = await ytld.getInfo(url);
            const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
            const filePath = path.join(downloadPath, `${title}.mp4`);

            // Descargar el video
            ytld(url)
                .pipe(fs.createWriteStream(filePath))
                .on('finish', () => {
                    res.download(filePath, `${title}.mp4`, (err) => {
                        if (err) {
                            console.error(err);
                            reject('Error downloading the video ' + err);
                        } else {
                            resolve(`Video downloaded to ${filePath}`);
                        }
                    });
                });
        } catch (error) {
            reject(error);
            throw error;        
        }
    })
}