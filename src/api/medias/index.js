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

mediasRouter.get("/", async (req, res, next) => {
    try {
        const medias = await getMedias()
        if (req.query && req.query.category) {
            const filteredMedias = medias.filter(media => media.category === req.query.category)
            res.send(filteredMedias)
        } else {
            res.send(medias)
        }
    } catch (error) {
        next(error)
    }
})

mediasRouter.get("/:mediaId", async (req, res, next) => {
    try {
        const mediasArray = await getMedias()

        const foundMedia = mediasArray.find(media => media.id === req.params.mediaId)
        if (foundMedia) {
            res.send(foundMedia)
        } else {
            next(createHttpError(404, `Movie with id ${req.params.mediaId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})



export default mediasRouter