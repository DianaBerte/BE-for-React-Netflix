import Express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import createHttpError from "http-errors";
import mediasRouter from "./api/medias/index.js";

const server = Express()
const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "./public")

// ********************************************* CORS ************************************************

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

server.use(Express.static(publicFolderPath))
server.use(
    cors({
        origin: (currentOrigin, corsNext) => {
            if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
                corsNext(null, true)
            } else {
                corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
            }
        },
    })
)
server.use(Express.json())

// ************************** ENDPOINTS ***********************
server.use("/medias", mediasRouter)

server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})