import fs from 'fs';
import ytld from 'ytdl-core'
import { Router } from "express";
const router = Router();

export const descargar = (req, res) => {
    res.send('oie zi');
}
router.get('/', descargar);
export default router;