import React, {useContext, useEffect, useState, useRef} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import {EnableDragContext, MobileContext, SelectedFolderContext, ImageSizeContext, SiteHueContext, SiteSaturationContext, SiteLightnessContext} from "../Context"
import functions from "../structures/Functions"
import Slider from "react-slider"
import Image from "./Image"
import "./styles/imagegrid.less"

const ImageGrid: React.FunctionComponent = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {selectedFolder, setSelectedFolder} = useContext(SelectedFolderContext)
    const {imageSize, setImageSize} = useContext(ImageSizeContext)
    const [images, setImages] = useState([])
    const ref = useRef<HTMLCanvasElement>(null)
    const history = useHistory()

    const updateImages = async () => {
        const data = await fetch(`/images/${selectedFolder}/files.json`).then((r) => r.json())
        const images = data.files.map((file: string) => `/images/${selectedFolder}/${file}`)
        setImages(images)
    }

    useEffect(() => {
        updateImages()
    }, [selectedFolder])

    const generateJSX = () => {
        let jsx = [] as any 
        for (let i = 0; i < images.length; i++) {
            jsx.push(
                <Image img={images[i]}/>
            )
        }
        return jsx
    }

    return (
        <div className="image-grid" onMouseEnter={() => setEnableDrag(true)}>
            {generateJSX()}
        </div>
    )
}

export default ImageGrid