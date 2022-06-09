"use stric"
const form = document.getElementById("form")
const input = document.getElementById('message')
const display = document.getElementById("display")
let entry = ""
form.addEventListener("submit", (e) => {
    e.preventDefault()
    entry = new FormData(form).get("message")
    print(entry, "right")
    input.value = ""
    conversation(entry)
    display.scroll(0, display.scrollHeight)
})
function print(str, side){
    if(str){
        let message = document.createElement("div")
        message.className = `message message-${side}`
        message.innerHTML = str
        display.appendChild(message)
    }
    
}