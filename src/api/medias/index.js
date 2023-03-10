import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import { Transform } from "@json2csv/node";
import { getMedias, writeMedias, getMediasJSONReadableStream, savePosters } from "../../lib/fs-tools.js";
import { asyncPDFGeneration, getPDFReadableStream } from "../../lib/pdf-tools.js";

const mediasRouter = Express.Router()

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "netflix/movies",
        },
    }),
}).single("poster")

//POST Media
mediasRouter.post("/", async (req, res, next) => {
    const newMedia = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }

    const mediasArray = await getMedias()
    mediasArray.push(newMedia)
    await writeMedias(mediasArray)

    res.status(201).send({ id: newMedia.id })
})

//GET Media (list)
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

//GET Media (single)
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

// /medias/:id/poster
//POST Upload poster to single media
mediasRouter.post("/:mediaId/poster", multer().single("poster"), async (req, res, next) => {
    try {
        console.log("Poster:", req.file)
        const originalFileExtension = extname(req.file.originalname)
        const fileName = req.params.mediaId + originalFileExtension
        await savePosters(fileName, req.file.buffer)
        res.send({ message: "Poster uploaded!" })
    } catch (error) {
        next(error)
    }
})

// medias/:id/pdf
//Export single media data as PDF
mediasRouter.get("/:mediaId/pdf", async (req, res, next) => {
    try {
        res.setHeader("Content-Disposition", "attachment; filename=movie.pdf")
        const medias = await getMedias()
        const source = getPDFReadableStream(medias[0])
        const destination = res

        pipeline(source, destination, err => {
            if (err) console.log(err)
        })
    } catch (error) {
        next(error)
    }
})

mediasRouter.get("/:mediaId/asyncPDF", async (req, res, next) => {
    try {
        const medias = await getMedias()
        await asyncPDFGeneration(medias[1])
        res.send({ message: "PDF GENERATED CORRECTLY" })
    } catch (error) {
        next(error)
    }
})



export default mediasRouter