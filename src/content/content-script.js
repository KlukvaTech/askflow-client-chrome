const sendHTML = () => {
    const msg = { text: document.documentElement.innerHTML }
    chrome.runtime.sendMessage(msg);
}

const searchAndHighlight = (answer, context) => {
    const instance = new Mark(document.body);
    let isContextSet = true;
    instance.unmark();
    instance.mark(context, {
        "className": "askflow-context",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=\n ".split(""),
        "ignoreJoiners": true,
        "debug": true,
        "element" : "span",
        "noMatch" : () => {
            isContextSet = false;
        }
    });
    let bodyContext = null;
    if (isContextSet)
        bodyContext = new Mark(document.querySelectorAll("span.askflow-context"));
    else
        bodyContext = new Mark(document.body);
    //bodyContext.unmark()
    bodyContext.mark(answer, {
        "className": "askflow-highlight",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=\n ".split(""),
        "ignoreJoiners": true,
        "debug": true,
        "element" : "span"
    });

    document.querySelector(".askflow-highlight").scrollIntoView({behavior: "smooth"});
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
