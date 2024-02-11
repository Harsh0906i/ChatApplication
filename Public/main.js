let socket = io()
const totalclient = document.querySelector(".client-total");
const messages = document.querySelector(".message-container");
const nameInput = document.querySelector(".inp-name");
const messageInp = document.querySelector(".message-inp");
const form = document.querySelector(".message-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendmessage();
})

function sendmessage() {
    if (messageInp.value === '') {
        return
    }
    console.log(messageInp.value);
    const data = {
        name: nameInput.value,
        message: messageInp.value,
        dateTime: new Date()
    }
    socket.emit("message", data);
    AddMessage(true, data);
    messageInp.value = '';
}

socket.on('chat-message', (data) => {
    AddMessage(false, data);
});
socket.on("clients-total", (data) => {
    console.log(data)
    totalclient.innerText = `Total People : ${data}`;
});

function AddMessage(isOwn, data) {
    clear();
    const element =
        `<li class="${isOwn ? "message-right" : "message-left"}">
    <p class="message">
        ${data.message}
        <span>${data.name}</span>
    </p>
</li>`
    messages.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messages.scrollTo(0, messages.scrollHeight);
}

messageInp.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})
messageInp.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ` `
    })
})
messageInp.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})
socket.on('feedback', (data) => {
    clear();
    const element = ` <li class="message-feedback">
    <p class="feedback">
        ${data.feedback}</p>
</li>`
    messages.innerHTML += element
})

function clear() {
    document.querySelectorAll("li.message-feedback").forEach(element => {
        element.parentNode.removeChild(element)
    })
}