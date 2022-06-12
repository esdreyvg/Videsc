import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import command from './controllers/command.js'

/* Config Environment */
const environment = JSON.parse(await fs.readFile('./src/config/env.json', 'utf8'));
const env = process.env.NODE_ENV || 'development'
const server = environment[env]
/* Config Server */
const app = express()
const port = server.PORT;
const allowedOrigin = [server.URL];
const option = {
    origin: allowedOrigin
};
/* Config Express */
app.set("port", port)
app.use(cors(option))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/* Use API */
app.use(command)

export default app