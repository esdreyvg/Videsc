import fs from 'fs/promises';
import ytld from 'ytdl-core';
import { Router } from "express";
import HttpsProxyAgent from 'https-proxy-agent';
import { messageJson, dataJson, errorJson } from './../config/format.js';
import {download, youtube} from '../modules/download.js';
import downloadOptions, { pathOptions } from '../modules/options.js';

const router = Router();
/* Config Environment */
const environment = JSON.parse(await fs.readFile('./src/config/env.json', 'utf8'));
const env = process.env.NODE_ENV || 'development';
const server = environment[env];

export const validate = (req, res) => {
    const {url} = req.body;
    res.send(messageJson(ytld.validateURL(url)));
}

export const info = async (req, res) => {
    const {url} = req.body;
    const infoVideo = await ytld.getInfo(url);
    const quality = infoVideo.formats.map((item)=> {return item.qualityLabel + ' - ' + item.container});
    try {
        res.send(dataJson({
            title: infoVideo.videoDetails.title,
            private: infoVideo.videoDetails.isPrivate,
            quality: quality,
        }));
    } catch (error) {
        console.error(error);
        res.send(errorJson(1, error));
    }
}

export const descargar = async (req, res) => {
    const proxy = process.env.http_proxy || server;
    const agent = HttpsProxyAgent(proxy);

    const option = downloadOptions(req.headers.cookies, agent);
    const {url, title} = req.body;
    const pathFile = pathOptions(title);
    try {
        const response = await download(url, pathFile, option);
        res.send(messageJson(response));
    } catch (error) {
        console.error(error);
        res.send(errorJson(1, error));
    }
}

export const descargarPlayList = async (req, res) => {
    const proxy = process.env.http_proxy || server;
    const agent = HttpsProxyAgent(proxy);

    const option = downloadOptions(req.headers.cookies, agent);
    const {urlList} = req.body;
    try {
        const response = urlList.map(async (item) => {
            const videoInfo = await ytld.getInfo(item);
            const pathFile = pathOptions(videoInfo.videoDetails.title);
            return await download(item, pathFile, option);
        });
        res.send(messageJson(response));
    } catch (error) {
        console.error(error);
        res.send(errorJson(1, error));
    }
}

export const downloadYt = async (req, res) => {
    const videoUrl = req.body.url;
    const downloadPath = req.body.path || 'downloads';

    if (!videoUrl) {
        return res.status(400).send('No video URL provided.');
    }
    try {
        const response = await youtube(videoUrl, downloadPath);
        res.send(messageJson(response));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching video information.');
    }
}

router.post('/download', descargar);
router.post('/yt', downloadYt);
router.post('/playlist', descargarPlayList);
router.post('/validar', validate);
router.post('/info', info);
export default router;