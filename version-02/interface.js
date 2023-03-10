"use stric"

const form = document.getElementById("form")
const input = document.getElementById('message')
const display = document.getElementById("display")
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