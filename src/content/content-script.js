const sendHTML = () => {
    const msg = {
        text: document.documentElement.innerText
    }
    chrome.runtime.sendMessage(msg);
}

const searchAndHighlight = (answer, context) => {
    const instance = new Mark(document.body);
    instance.unmark();
    instance.mark(context, {
        "element": "span",
        "className": "askflow-context",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": [
            ",",
            ".",
            "!",
            "-",
            "—",
            ":",
            ";"
        ]
    });
    const bodyContext = new Mark(document.querySelectorAll("span.askflow-context"));
    bodyContext.mark(answer, {
        "element": "span",
        "className": "askflow-highlight",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": [
            ",",
            ".",
            "!"
        ]
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
            console.log("Context", msg.context);
            console.log("Highlighting answer", msg.answer);
            searchAndHighlight(msg.answer, msg.context);
            break;
        }
        default: {
            console.error("Unknown message");
        }
    }
}

chrome.runtime.onMessage.addListener(handleMsg);
