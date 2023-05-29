import React, {useContext, useEffect, useState, useRef} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import favicon from "../assets/icons/favicon.png"
import {EnableDragContext, MobileContext, SiteHueContext, SiteSaturationContext, SiteLightnessContext, BrightnessContext, ContrastContext, HueContext, SaturationContext, LightnessContext, BlurContext, SharpenContext, PixelateContext, ImageSizeContext} from "../Context"
import functions from "../structures/Functions"
import Slider from "react-slider"
import color from "../assets/icons/color.png"
import size from "../assets/icons/size.png"
import effects from "../assets/icons/effects.png"
import logo from "../assets/icons/logo.png"
import "./styles/titlebar.less"

const colorList = {
    "--selection": "rgba(168, 203, 255, 0.302)",
    "--text": "#1a73ff",
    "--buttonBG": "#177cff",
    "--background": "#0f142a",
    "--titlebarBG": "#121835",
    "--sliderBG": "#030e1f",
    "--inputBG": "#092655",
    "--patternBorder": "#153fdd",
    "--patternBorder2": "#dd34a5",
    "--navbarButtonBG": "#050d22",
    "--navbarButtonBorder": "#1f4fee"
}

interface Props {
    rerender: () => void
}

let pos = 0

const TitleBar: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {siteHue, setSiteHue} = useContext(SiteHueContext)
    const {siteSaturation, setSiteSaturation} = useContext(SiteSaturationContext)
    const {siteLightness, setSiteLightness} = useContext(SiteLightnessContext)
    const {imageSize, setImageSize} = useContext(ImageSizeContext)
    const {brightness, setBrightness} = useContext(BrightnessContext)
    const {contrast, setContrast} = useContext(ContrastContext)
    const {hue, setHue} = useContext(HueContext)
    const {saturation, setSaturation} = useContext(SaturationContext)
    const {lightness, setLightness} = useContext(LightnessContext)
    const {blur, setBlur} = useContext(BlurContext)
    const {sharpen, setSharpen} = useContext(SharpenContext)
    const {pixelate, setPixelate} = useContext(PixelateContext)
    const [activeDropdown, setActiveDropdown] = useState("")
    const colorRef = useRef<HTMLImageElement>(null)
    const sizeRef = useRef<HTMLImageElement>(null)
    const effectsRef = useRef<HTMLImageElement>(null)
    const history = useHistory()
    const [colorPos, setColorPos] =  useState(0)

    useEffect(() => {
        const savedSiteHue = localStorage.getItem("siteHue")
        const savedSiteSaturation = localStorage.getItem("siteSaturation")
        const savedSiteLightness = localStorage.getItem("siteLightness")
        const savedSize = localStorage.getItem("imageSize")        
        const savedBrightness = localStorage.getItem("brightness")
        const savedContrast = localStorage.getItem("contrast")
        const savedHue = localStorage.getItem("hue")
        const savedSaturation = localStorage.getItem("saturation")
        const savedLightness = localStorage.getItem("lightness")
        const savedBlur = localStorage.getItem("blur")
        const savedSharpen = localStorage.getItem("sharpen")
        const savedPixelate = localStorage.getItem("pixelate")
        if (savedBrightness) setBrightness(Number(savedBrightness))
        if (savedContrast) setContrast(Number(savedContrast))
        if (savedHue) setHue(Number(savedHue))
        if (savedSaturation) setSaturation(Number(savedSaturation))
        if (savedLightness) setLightness(Number(savedLightness))
        if (savedBlur) setBlur(Number(savedBlur))
        if (savedSharpen) setSharpen(Number(savedSharpen))
        if (savedPixelate) setPixelate(Number(savedPixelate))
        if (savedSiteHue) setSiteHue(Number(savedSiteHue))
        if (savedSiteSaturation) setSiteSaturation(Number(savedSiteSaturation))
        if (savedSiteLightness) setSiteLightness(Number(savedSiteLightness))
        if (savedSize) setImageSize(Number(savedSize))
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return
        for (let i = 0; i < Object.keys(colorList).length; i++) {
            const key = Object.keys(colorList)[i]
            const color = Object.values(colorList)[i]
            document.documentElement.style.setProperty(key, functions.rotateColor(color, siteHue, siteSaturation, siteLightness))
        }
        setTimeout(() => {
            props.rerender()
        }, 100)
        localStorage.setItem("siteHue", siteHue)
        localStorage.setItem("siteSaturation", siteSaturation)
        localStorage.setItem("siteLightness", siteLightness)
    }, [siteHue, siteSaturation, siteLightness])

    useEffect(() => {
        localStorage.setItem("imageSize", imageSize)
        localStorage.setItem("brightness", brightness)
        localStorage.setItem("contrast", contrast)
        localStorage.setItem("hue", hue)
        localStorage.setItem("saturation", saturation)
        localStorage.setItem("lightness", lightness)
        localStorage.setItem("blur", blur)
        localStorage.setItem("sharpen", sharpen)
        localStorage.setItem("pixelate", pixelate)
    }, [imageSize, brightness, contrast, hue, saturation, lightness, blur, sharpen, pixelate])

    const resetHSL = () => {
        setSiteHue(189)
        setSiteSaturation(100)
        setSiteLightness(50)
        setTimeout(() => {
            props.rerender()
        }, 100)
    }

    const resetSize = () => {
        setImageSize(500)
    }

    const resetEffects = () => {
        setBrightness(100)
        setContrast(100)
        setHue(180)
        setSaturation(100)
        setLightness(100)
        setBlur(0)
        setSharpen(0)
        setPixelate(1)
    }

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--text")
        return functions.calculateFilter(color)
    }

    const changeDropdown = (dropdown: string) => {
        setActiveDropdown((prev: string) => {
            if (prev === dropdown) return ""
            return dropdown
        })
    }

    const getColorMarginLeft = () => {
        if (typeof document === "undefined") return "0px"
        const rect = colorRef.current?.getBoundingClientRect()
        if (!rect) return "0px"
        const raw = rect.left
        let offset = -95
        return `${raw + offset}px`
    }

    const getSizeMarginLeft = () => {
        if (typeof document === "undefined") return "0px"
        const rect = sizeRef.current?.getBoundingClientRect()
        if (!rect) return "0px"
        const raw = rect.left
        let offset = -85
        return `${raw + offset}px`
    }

    const getEffectsMarginLeft = () => {
        if (typeof document === "undefined") return "0px"
        const rect = effectsRef.current?.getBoundingClientRect()
        if (!rect) return "0px"
        const raw = rect.left
        let offset = -95
        return `${raw + offset}px`
    }


    return (
        <div className={`titlebar`} onMouseEnter={() => setEnableDrag(false)}>
            <div className="titlebar-logo-container">
                <span className="titlebar-hover">
                    <div className="titlebar-text-container">
                        <img className="titlebar-img" src={logo}/>
                    </div>
                </span>
            </div>
            <div className="titlebar-container">
                <div className="titlebar-color-container">
                    <img className="titlebar-color-icon" src={color} onClick={() => changeDropdown("color")} ref={colorRef}/>
                    <img className="titlebar-color-icon" src={size} onClick={() => changeDropdown("size")} ref={sizeRef}/>
                    <img className="titlebar-color-icon" src={effects} onClick={() => changeDropdown("effects")} ref={effectsRef}/>
                </div>
            </div>
            <div className={`title-dropdown ${activeDropdown === "color" ? "" : "hide-title-dropdown"}`} style={{marginLeft: getColorMarginLeft()}}>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Hue</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setSiteHue(value)} min={60} max={300} step={1} value={siteHue}/>
                </div>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Saturation</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setSiteSaturation(value)} min={50} max={100} step={1} value={siteSaturation}/>
                </div>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Lightness</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setSiteLightness(value)} min={45} max={55} step={1} value={siteLightness}/>
                </div>
                <div className="title-dropdown-row">
                    <button className="title-dropdown-button" onClick={() => resetHSL()}>Reset</button>
                </div>
            </div>
            <div className={`title-dropdown ${activeDropdown === "size" ? "" : "hide-title-dropdown"}`} style={{marginLeft: getSizeMarginLeft()}}>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Size</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setImageSize(value)} min={100} max={1000} step={1} value={imageSize}/>
                </div>
                <div className="title-dropdown-row">
                    <button className="title-dropdown-button" onClick={() => resetSize()}>Reset</button>
                </div>
            </div>
            <div className={`title-dropdown ${activeDropdown === "effects" ? "" : "hide-title-dropdown"}`} style={{marginLeft: getEffectsMarginLeft()}}>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Brightness</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setBrightness(value)} min={50} max={150} step={1} value={brightness}/>
                </div>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Contrast</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setContrast(value)} min={50} max={150} step={1} value={contrast}/>
                </div>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Hue</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setHue(value)} min={150} max={210} step={1} value={hue}/>
                </div>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Saturation</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setSaturation(value)} min={50} max={150} step={1} value={saturation}/>
                </div>
                <div className="title-dropdown-row">
                    <span className="title-dropdown-text">Blur</span>
                    <Slider className="title-dropdown-slider" trackClassName="title-dropdown-slider-track" thumbClassName="title-dropdown-slider-thumb" onChange={(value) => setBlur(value)} min={0} max={2} step={0.1} value={blur}/>
                </div>
                <div className="title-dropdown-row">
                    <button className="title-dropdown-button" onClick={() => resetEffects()}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default TitleBar