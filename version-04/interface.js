"use stric"

const form = document.getElementById("form")
const input = document.getElementById('message')
const display = document.getElementById("display")

printLeft("Warning:")
printLeft(`1.-This is a simplified version of the model, so it is not very intelligent.`)
printLeft(`2.-This model is not trained, so you can experience the ease with which 
this model can be trained, however because of this you must follow certain 
instructions. `)
printLeft(`instructions:`)
printLeft(`
    adding elements.
    try "an oak is a tree", then write: "a pine is a tree", then "a pine is a plant".
    after answering the questions it generates try "is an oak a plant?"
`)
printLeft(`
    After this you can try: "an oak tree is a living-being", 
    answer the generated questions. Then do the same but with animals, 
    for example: "a pig is an animal", "a hen is a bird", "a bird is animal", 
    "a parrot is a bird", "a parrot is a living-being" 
    and then you can ask: "what is the relationship between a pig and an oak?" 
    or between any other node or you can also ask: "is a NODE a NODE?" as for example: "is a parrot a plant?
`)
printLeft(`
    adding properties.
    you can say: "color is an adjective" and then: "green is a color", 
    then: "an oak is green", you can do the same with any other property, 
    for example: "size is an adjective", then: "tall is a size" and then: 
    "a pine is tall". 
`)

let entry = ""
form.addEventListener("submit", (e) => {
    e.preventDefault()
    entry = new FormData(form).get("message")
    printRight(entry)
    input.value = ""
    conversation(entry)
    display.scroll(0, display.scrollHeight)
})
function printLeft(str){
    if(str){
        let message = document.createElement("div")
        message.className = `message message-left`
        message.innerHTML = str
        display.appendChild(message)
    }
}
function printRight(str){
    if(str){
        let message = document.createElement("div")
        message.className = `message message-right`
        message.innerHTML = str
        display.appendChild(message)
    }
}

function printCenter(str){
    if(str){
        let message = document.createElement("div")
        message.className = `message message-center`
        message.innerHTML = str
        display.appendChild(message)
    }
}