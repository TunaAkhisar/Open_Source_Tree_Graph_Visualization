import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Treee from "./Tree"
import App from "../App"

import Tree from "react-d3-tree"
import RightContainer from "./rightContainer/RightContainer"


// Test 1
test("Render Test",() => {
    render(<Treee />)
})

test("Right Container",() => {
    render(<RightContainer />)
})
