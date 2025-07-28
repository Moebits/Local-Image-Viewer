import path from "path"
import cors from "cors"
import mime from "mime"
import fs from "fs"
import express from "express"
import dotenv from "dotenv"
const __dirname = path.resolve()

dotenv.config()
const app = express()
app.use(express.urlencoded({extended: true, limit: "1gb", parameterLimit: 50000}))
app.use(express.json({limit: "1gb"}))
app.use(cors({credentials: true, origin: true}))
app.disable("x-powered-by")
app.set("trust proxy", true)

app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "./dist"), {index: false}))
app.use("/assets", express.static(path.join(__dirname, "./assets")))

const getImagesLocation = () => {
  return process.env.FOLDER ? process.env.FOLDER : path.join(__dirname, "./images")
}

const getDirectories = (source: string) => {
  return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isDirectory()).map(file => `"${file.name}"`)
}

const writeFolderJSON = () => {
  let json = `{"folders": [${getDirectories(getImagesLocation()).join(", ")}]}`
  fs.writeFileSync(path.join(__dirname, "./assets/misc/folders.json"), json)
}

const getFiles = (source: string) => {
  return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isFile()).map(file => `"${file.name}"`)
}

const writeFileJSON = () => {
  const directories = getDirectories(getImagesLocation())
  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i].replaceAll("\"", "")
    let json = `{"files": [${getFiles(path.join(getImagesLocation(), directory)).join(", ")}]}`
    fs.writeFileSync(path.join(getImagesLocation(), `./${directory}/files.json`), json)
  }
}

app.get("/images/*", function(req, res, next) {
  const filename = req.path.replace("/images/", "")
  const file = fs.readFileSync(path.join(getImagesLocation(), decodeURIComponent(filename)))
  res.status(200).send(file)
})

app.get("/update", function(req, res, next) {
  writeFolderJSON()
  writeFileJSON()
  res.status(200).end()
})

app.get("/*", function(req, res, next) {
    if (req.path.startsWith("/images")) return next()
    res.setHeader("Content-Type", mime.getType(req.path) ?? "")
    res.header("Access-Control-Allow-Origin", "*")
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
    const document = fs.readFileSync(path.join(__dirname, "./dist/index.html"), {encoding: "utf-8"})
    res.status(200).send(document)
})

const run = async () => {
  writeFolderJSON()
  writeFileJSON()
  app.listen(process.env.PORT || 8083, () => console.log("Started the website server!"))
}

run()