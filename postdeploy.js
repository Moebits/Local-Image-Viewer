const fs = require("fs")
const path = require("path")
const child_process = require("child_process")

const getDirectories = (source) => {
    return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isDirectory()).map(file => `"${file.name}"`)
  }
  
  const writeFolderJSON = () => {
    let json = `{"folders": [${getDirectories(path.join(__dirname, "./images")).join(", ")}]}`
    if (!fs.existsSync(path.join(__dirname, "dist", "./assets/misc"))) fs.mkdirSync(path.join(__dirname, "dist", "./assets/misc"), {recursive: true})
    fs.writeFileSync(path.join(__dirname, "dist", "./assets/misc/folders.json"), json)
  }
  
  const getFiles = (source) => {
    return fs.readdirSync(source, {withFileTypes: true}).filter(file => file.isFile()).map(file => `"${file.name}"`)
  }
  
  const writeFileJSON = () => {
    const directories = getDirectories(path.join(__dirname, "./images"))
    for (let i = 0; i < directories.length; i++) {
      const directory = directories[i].replaceAll("\"", "")
      let json = `{"files": [${getFiles(path.join(__dirname, "./images", directory)).join(", ")}]}`
      fs.writeFileSync(path.join(__dirname, "dist", `./images/${directory}/files.json`), json)
    }
  }

writeFolderJSON()
child_process.execSync("cp -r /Users/chris/Documents/Moepi/Programming/Websites/local-image-viewer/images /Users/chris/Documents/Moepi/Programming/Websites/local-image-viewer/dist")
writeFileJSON()