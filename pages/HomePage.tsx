import React, {useEffect, useContext, useReducer, useState} from "react"
import {EnableDragContext} from "../Context"
import NavBar from "../components/NavBar"
import ImageGrid from "../components/ImageGrid"
import TitleBar from "../components/TitleBar"

const HomePage: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {enableDrag, setEnableDrag} = useContext(EnableDragContext)

    useEffect(() => {
        document.title = "Local Image Viewer"
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <NavBar rerender={forceUpdate}/>
        <div className="body">
            <ImageGrid/>
        </div>
        </>
    )
}

export default HomePage