import path from "path"
import cors from "cors"
import mime from "mime"
import {Readable} from "stream"
import fs from "fs"
import express from "express"
import webpack from "webpack"
import middleware from "webpack-dev-middleware"
import hot from "webpack-hot-middleware"
import config from "./webpack.config"
import dotenv from "dotenv"
import React from "react"
import App from "./App"
import {renderToString} from "react-dom/server"
import {StaticRouter as Router} from "react-router-dom"
const __dirname = path.resolve()

dotenv.config()
const app = express()
let compiler = webpack(config as any)
app.use(express.urlencoded({extended: true, limit: "1gb", parameterLimit: 50000}))
app.use(express.json({limit: "1gb"}))
app.use(cors({credentials: true, origin: true}))
app.disable("x-powered-by")
app.set("trust proxy", true)

if (process.env.TESTING === "yes") {
  app.use(middleware(compiler, {
    index: false,
    serverSideRender: false,
    writeToDisk: false,
  }))
  app.use(hot(compiler))
}

app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "./dist"), {index: false}))
app.use("/assets", express.static(path.join(__dirname, "./assets")))
app.use("/images", express.static(path.join(__dirname, "./images")))

const getDirectories = (source: string) => {
  return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isDirectory()).map(file => `"${file.name}"`)
}

const writeFolderJSON = () => {
  let json = `{"folders": [${getDirectories(path.join(__dirname, "./images")).join(", ")}]}`
  fs.writeFileSync(path.join(__dirname, "./assets/misc/folders.json"), json)
}

const getFiles = (source: string) => {
  return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isFile()).map(file => `"${file.name}"`)
}

const writeFileJSON = () => {
  const directories = getDirectories(path.join(__dirname, "./images"))
  for (let i = 0; i < directories.length; i++) {
    const directory = directories[i].replaceAll("\"", "")
    let json = `{"files": [${getFiles(path.join(__dirname, "./images", directory)).join(", ")}]}`
    fs.writeFileSync(path.join(__dirname, `./images/${directory}/files.json`), json)
  }
}

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
  app.listen(process.env.PORT || 8085, () => console.log("Started the website server!"))
}

run()