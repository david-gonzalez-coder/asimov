"use stric"
const form = document.getElementById("form")
const input = document.getElementById('message')
const display = document.getElementById("display")

function print(str, side){
    if(str){
        let message = document.createElement("div")
        message.className = `message message-${side}`
        message.innerHTML = str
        display.appendChild(message)
    }
}
export {print, form, input, display}