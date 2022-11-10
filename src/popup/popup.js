let html

const sendHTMLRequest = () => {
    console.log("Sending HTML request to content...")
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {});
    });
}

async function submitQuestion(event){
    event.preventDefault();
    console.log(html)
    if (html === null || html === ""){
        console.warn("Empty HTML")
        sendHTMLRequest()
        return;
    }

    let question = questionForm.querySelector("#search-bar-input").value;
    console.log("Question:", question)
   
    let response = await fetch('https://8sh18d.deta.dev/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({text: html, question: question}) 
        }
    );

    response.json().then(function(data){
            console.log("Answer:", data.answer);
            console.log("Confidence", data.score)
        }
    ); 
}

const handleMsg = (msg, sender, callback) => {
    console.log("Recived message")
    html = msg.html;
}

chrome.runtime.onMessage.addListener(handleMsg);
const questionForm = document.getElementById("question-form")
questionForm.addEventListener('submit', submitQuestion)
sendHTMLRequest()