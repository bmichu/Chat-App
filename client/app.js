
const loginForm = document.getElementById('welcome-form');
const addMessageForm = document.getElementById('add-messages-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

/* SOCKET IO */
const socket = io(); // zainicjuj nowego klienta socketowego i zachowaj referencje do niego pod stałą socket.
socket.on('message', ({ author, content }) => addMessage(author, content));



/* SET UP LOGINFORM */
    var userName;

    const welcomFormListener = () => (loginForm.onsubmit = () => {
        signIn(userNameInput.value);
        return false; 
    });

    welcomFormListener();

    const signIn = name => {
        if(name == ''){
            alert('Login cannot be empty.');
        } else{
            userName = name;
            socket.emit('newUser', { author: userName });
            loginForm.classList.remove('show');
            messagesSection.classList.add('show');

        }
    }
 
/* SET UP ADDMESSAGEFORM */

    const messageFormListener = (params) => (addMessageForm.onsubmit = () => {
        sendMessage(messageContentInput.value);
        return false;
    });

    messageFormListener();

    const sendMessage = (text) => {
        if(text == ''){
            alert('Text field is empty.')
        }else{
            addMessage(userName, text);
            socket.emit('message', { author: userName, content: text });
        }
    }

    const addMessage = (author, content) => {
        const message = document.createElement('li');
        message.classList.add('message');
        message.classList.add('message--received');
        if(author === userName) message.classList.add('message--self');
        message.innerHTML = `
          <h3 class="message__author">${userName === author ? 'You' : author }</h3>
          <div class="message__content">
            ${content}
          </div>
        `;
        messagesList.appendChild(message);
        messageContentInput.value = '';
      }