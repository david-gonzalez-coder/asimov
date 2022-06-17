import {
    Node,
    addNode,
    updateNode,
    updateBranch,
    deleteNode,
    addNodes,
    getBranch,
    deleteBranch
} from "./graphHandlers.js"
import nodes from "./initGraph.js"
import {print, form, input, display} from "./interface.js"

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let entry = new FormData(form).get("message")
    print(entry, "right")
    input.value = ""
    conversation(entry)
    display.scroll(0, display.scrollHeight)
})

function conversation(entry){
    let elements = entry
        .trim()
        .replaceAll(/[,\?!¡]/g, str => " " + str + " ")
        .split(" ")
        .filter(str => str !== "")

}


