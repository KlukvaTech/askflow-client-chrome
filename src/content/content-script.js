const sendHTML = () => {
    const msg = { text: document.documentElement.innerText }
    chrome.runtime.sendMessage(msg);
}

const searchAndHighlight = (answer, context) => {
    const instance = new Mark(document.body);
    instance.unmark();
    instance.mark(context, {
        "className": "askflow-context",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=\n ".split(""),
        "ignoreJoiners": true,
        "debug": true
    });
    const bodyContext = new Mark(document.querySelectorAll("mark.askflow-context"));
    //bodyContext.unmark()
    bodyContext.mark(answer, {
        "className": "askflow-highlight",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=\n ".split(""),
        "ignoreJoiners": true,
        "debug": true
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
