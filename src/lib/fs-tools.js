import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createWriteStream } from "fs";

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const mediasJSONPath = join(dataFolderPath, "medias.json")
const postersPublicFolderPath = join(process.cwd(), "./public/img/posters")
console.log("Root of the project path:", process.cwd())
console.log("Posters public folder path:", postersPublicFolderPath)

export const getMedias = () => readJSON(mediasJSONPath)
export const writeMedias = mediasArray => writeJSON(mediasJSONPath, mediasArray)

export const getMediasJSONReadableStream = () => createReadStream(mediasJSONPath)

export const savePosters = (fileName, fileContentAsBuffer) => writeFile(join(postersPublicFolderPath, fileName), fileContentAsBuffer) 