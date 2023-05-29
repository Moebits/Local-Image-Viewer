import React, {useContext, useEffect, useState, useRef} from "react"
import {useHistory} from "react-router-dom"
import {HashLink as Link} from "react-router-hash-link"
import {EnableDragContext, MobileContext, SelectedFolderContext, SiteHueContext, SiteSaturationContext, SiteLightnessContext} from "../Context"
import functions from "../structures/Functions"
import Slider from "react-slider"
import "./styles/navbar.less"

interface Props {
    rerender: () => void
}

const NavBar: React.FunctionComponent<Props> = (props) => {
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)
    const {mobile, setMobile} = useContext(MobileContext)
    const {selectedFolder, setSelectedFolder} = useContext(SelectedFolderContext)
    const [folders, setFolders] = useState([])
    const ref = useRef<HTMLCanvasElement>(null)
    const history = useHistory()

    useEffect(() => {
        const savedFolder = localStorage.getItem("selectedFolder")
        if (savedFolder) setSelectedFolder(savedFolder)
    }, [])

    useEffect(() => {
        localStorage.setItem("selectedFolder", selectedFolder)
    }, [selectedFolder])

    const fetchDirectories = async () => {
        const data = await fetch("/assets/misc/folders.json").then((r) => r.json())
        setFolders(data.folders)
    }

    useEffect(() => {
        fetchDirectories()
    }, [])

    const generateJSX = () => {
        let jsx = [] as any 
        for (let i = 0; i < folders.length; i++) {
            jsx.push(
                <div className="navbar-item" onClick={() => setSelectedFolder(folders[i])}>{functions.toProperCase(folders[i])}</div>
            )
        }
        return jsx
    }

    return (
        <div className="navbar" onMouseEnter={() => setEnableDrag(true)}>
            {generateJSX()}
        </div>
    )
}

export default NavBar