let html = "";

const sendHTMLRequest = () => {
    console.log("Sending HTML request to content...")
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {});
    });
}
sendHTMLRequest();

const handleMsg = (msg, sender, callback) => {
    console.log("Recived message");
    html = msg.html;
}
chrome.runtime.onMessage.addListener(handleMsg);

const sendServerRequest = async(requestBody) =>{
    return fetch('https://8sh18d.deta.dev/text', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: requestBody 
        }
    );
}

const handleResponse = (response) => {
    response.json().then(function(data){
            console.log("Answer:", data.answer);
            console.log("Confidence", data.score);
        }
    ); 
}

const submitQuestion =  async(event) =>{
    event.preventDefault();
    
    if (html === undefined || html === ""){
        console.warn("Empty HTML");
        sendHTMLRequest();
        return;
    }
    console.log("Recived page HTML:", html);
    const question = questionForm.querySelector("#search-bar-input").value;
    console.log("Question:", question);
    console.log("Sending request on server...");

    const requestBody = JSON.stringify({text: html, question: question});
    const response = await sendServerRequest(requestBody);

    handleResponse(response);
}

const questionForm = document.getElementById("question-form");
questionForm.addEventListener('submit', submitQuestion);