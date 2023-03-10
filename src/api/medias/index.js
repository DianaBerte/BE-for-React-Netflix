import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getMedias, writeMedias } from "../../lib/fs-tools.js";

//     /medias
//         POST Media
//         GET Media (list)
//    /medias/:id
//         GET Media (single)
//    /medias/:id/poster
//         POST Upload poster to single media
//    medias/:id/pdf
//         Export single media data as PDF

const mediasRouter = Express.Router()

mediasRouter.post("/", async (req, res, next) => {
    const newMedia = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }

    const mediasArray = await getMedias()
    mediasArray.push(newMedia)
    await writeMedias(mediasArray)

    res.status(201).send({ id: newMedia.id })
})




export default mediasRouter