import React from "react"
import ReactDom from "react-dom"
const App =  () => {
    return (
        <div>
            <h1>Lets eats some pizzas !!</h1>
            <ul>
                <li><a href="/pizza/domino">Dominos</a></li>
            </ul>
        </div>
    )
}
ReactDom.render(<App/>,document.getElementById("root"));