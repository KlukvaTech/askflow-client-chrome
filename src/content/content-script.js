const sendHTML = () => {
    const msg = {
        text: document.documentElement.innerText
    }
    chrome.runtime.sendMessage(msg);
}

const searchAndHighlight = (search) => {
    var instance = new Mark(document.body);
    instance.unmark();
    instance.mark(search, {
        "element": "span",
        "className": "askflow-highlight",
        "acrossElements": true,
        "separateWordSearch": false
    });
}

const handleMsg = (msg, sender, callback) => {
    console.log("Recived message");
    switch(msg.type) {
        case "htmlRequest": {
            console.log("Sending HTML to popup...");
            sendHTML();
            break;
        }
        case "searchWord": {
            console.log("Highlighting word", msg.word);
            searchAndHighlight(msg.word);
            break;
        }
        default: {
            console.error("Unknown message");
        }
    }
}

chrome.runtime.onMessage.addListener(handleMsg);
