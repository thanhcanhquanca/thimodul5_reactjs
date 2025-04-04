import { useState } from 'react'
import './App.css'
import {Route, Routes} from "react-router";
import Songs from "./components/Songs/index.jsx";
import CreatFrom from "./components/Songs/creatFrom.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Routes>
                <Route path="/songs" element={<Songs/>}></Route>
                <Route path="/songs/create" element={<CreatFrom/>}></Route>

            </Routes>
        </>
    )
}

export default App
