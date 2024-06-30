
import { Route, Routes } from "react-router-dom";
import xva from "../Components/Graph";



function AppRoutes(){
    return(<Routes>
        <Route path = '/xva' element = {<xva/>}/>
    </Routes>)
}

export default AppRoutes;