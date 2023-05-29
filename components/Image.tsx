import React, {useContext, useEffect, useState, useRef} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import {EnableDragContext, MobileContext, ImageSizeContext, BrightnessContext, ContrastContext, HueContext, SaturationContext, LightnessContext, BlurContext, SharpenContext, PixelateContext, } from "../Context"
import functions from "../structures/Functions"
import Slider from "react-slider"
import "./styles/image.less"

interface Props {
    img: string
}

const Image: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {imageSize, setImageSize} = useContext(ImageSizeContext)
    const {brightness, setBrightness} = useContext(BrightnessContext)
    const {contrast, setContrast} = useContext(ContrastContext)
    const {hue, setHue} = useContext(HueContext)
    const {saturation, setSaturation} = useContext(SaturationContext)
    const {lightness, setLightness} = useContext(LightnessContext)
    const {blur, setBlur} = useContext(BlurContext)
    const {sharpen, setSharpen} = useContext(SharpenContext)
    const {pixelate, setPixelate} = useContext(PixelateContext)
    const ref = useRef<HTMLCanvasElement>(null)
    const history = useHistory()

    return (
        <div className="image-filters" onMouseEnter={() => setEnableDrag(true)} style={{filter: `brightness(${brightness}%) contrast(${contrast}%) hue-rotate(${hue - 180}deg) saturate(${saturation}%) blur(${blur}px)`}}>
            <img className="image" src={props.img} style={{height: `${imageSize}px`}}/>
        </div>
    )
}

export default Image