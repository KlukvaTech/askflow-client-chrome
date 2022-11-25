let pageText = "";

const sendRequestMessage = (messageBody) => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, messageBody);
    });
}
console.log("Sending HTML request to content...")
sendRequestMessage({type: "htmlRequest"});

const handleMsg = (msg, sender, callback) => {
    console.log("Recived message");
    pageText = msg.text;
}
chrome.runtime.onMessage.addListener(handleMsg);

const sendServerRequest = async(requestBody) => {
    return fetch('https://askflow-backend.onrender.com/onlytext', {
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
            sendRequestMessage({type: "searchWord", answer: data.answer, context: data.context})
        }
    ); 
}

const submitQuestion =  async(event) =>{
    event.preventDefault();
    
    if (pageText === undefined || pageText === ""){
        console.warn("Empty page text");
        return;
    }
    console.log("Recived page text:", pageText);

    const question = event.target.querySelector("#search-bar-input").value;
    if (question === null || question === "" ) {
        console.warn("Empty question field")
        return;
    }
        
    console.log("Question:", question);
    
    const requestBody = JSON.stringify({text: pageText, question: question});
    console.log("Sending request on server...");
    const response = await sendServerRequest(requestBody);
    handleResponse(response);
}
document.getElementById("question-form").addEventListener('submit', submitQuestion);