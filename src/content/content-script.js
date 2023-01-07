let answers = null;
let currAnsw = 0;

const sendHTML = () => {
    const msg = { text: document.documentElement.innerHTML }
    chrome.runtime.sendMessage(msg);
}

const searchAndHighlight = (result) => {
    const instance = new Mark(document.body);
    let isContextSet = true;
    instance.unmark();
    instance.mark(result.context, {
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
    bodyContext.mark(result.answer, {
        "className": "askflow-highlight",
        "acrossElements": true,
        "separateWordSearch": false,
        "ignorePunctuation": ":;.,-–—‒_(){}[]!'\"+=\n ".split(""),
        "ignoreJoiners": true,
        "debug": true,
        "element" : "span"
    });

    document.querySelector(".askflow-highlight").scrollIntoView({behavior: "smooth", block: "center"});
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
            console.log("Answers", msg);
            answers = msg.data;
            currAnsw = 0;
            searchAndHighlight(answers[0]);
            break;
        }
        case "previousAnswer": {
            console.log("prev");
            if(!(currAnsw === 0)) {
                currAnsw-= 1;
                searchAndHighlight(answers[currAnsw])
            }
            else {
                currAnsw = answers.length - 1;
                searchAndHighlight(answers[currAnsw])
            }
            break;
        }
        case "nextAnswer": {
            console.log("next");
            if(currAnsw + 1 < answers.length) {
                currAnsw++;
                searchAndHighlight(answers[currAnsw])
            }
            else {
                currAnsw = 0;
                searchAndHighlight(answers[currAnsw])
            }
            break;
        }
        default: {
            console.error("Unknown message");
        }
    }
}

chrome.runtime.onMessage.addListener(handleMsg);
