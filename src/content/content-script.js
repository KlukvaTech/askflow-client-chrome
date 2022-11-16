const sendHTML = () => {
    console.log("Sending HTML to popup...");
    const msg = {
        text: document.documentElement.innerText
    }
    chrome.runtime.sendMessage(msg);
}

const handleMsg = (msg, sender, callback) => {
    console.log("Recived message");
    sendHTML();  
}

chrome.runtime.onMessage.addListener(handleMsg);
