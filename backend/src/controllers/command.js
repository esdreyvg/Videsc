import fs from 'fs';
import ytld from 'ytdl-core'
import { Router } from "express";
import { messageJson, dataJson, errorJson } from './../config/format.js';

const router = Router();

export const validate = (req, res) => {
    const {url} = req.body;
    res.send(messageJson(ytld.validateURL(url)));
}

export const info = async (req, res) => {
    const {url} = req.body;
    const infoVideo = await ytld.getBasicInfo(url);
    try {
        res.send(dataJson({
            title: infoVideo.videoDetails.title,
            private: infoVideo.videoDetails.isPrivate
        }));
    } catch (error) {
        res.send(errorJson(1, error));
    }
}

export const descargar = (req, res) => {
    const header = req.headers;
    const {url} = req.body;
    const video = ytld(url);
    try {
        video.pipe(fs.createWriteStream(output))
        let starttime;
        video.pipe(fs.createWriteStream(output));
        video.once('response', () => {
        starttime = Date.now();
        });
        video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
        readline.moveCursor(process.stdout, 0, -1);
        });
        video.on('end', () => {
        process.stdout.write('\n\n');
        });
        res.send(messageJson('La descarga ha comenzado!'));
    } catch (error) {
        res.send(errorJson(1, error));
    }
    res.send({
        url: header.url,
        option: {
            resolution: header.resolution,
            type: header.type_video,
            total: header.count_video
        },
        message: 'oie zi'
    });
}

router.post('/download', descargar);
router.post('/validar', validate);
router.post('/info', info);
export default router;