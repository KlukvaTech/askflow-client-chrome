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
    return fetch('https://askflow-backend.onrender.com/onlyhtml', {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: requestBody 
        }
    );
}

const handleResponse = (response) => {
    response.json().then(function(data){
            console.log(data);
            sendRequestMessage({type: "searchWord", data: data})
        }
    ); 
}

const handleButtonUp = (event) => {
    sendRequestMessage({type: "previousAnswer"})
}
document.getElementById("up-button").addEventListener('click', handleButtonUp)

const handleButtonDown = (event) => {
    sendRequestMessage({type: "nextAnswer"})
}
document.getElementById("down-button").addEventListener('click', handleButtonDown)

const toggleVisibility = () => {
    document.getElementById("search-bar-submit-button-contanier").classList.toggle("hidden-element");
    document.getElementById("lds-ring").classList.toggle("hidden-element");
}


const submitQuestion =  async(event) =>{
    event.preventDefault();
    
    if (pageText === undefined || pageText === ""){
        console.warn("Empty page text");
        return;
    }

    const question = event.target.querySelector("#search-bar-input").value;
    if (question === null || question === "" ) {
        console.warn("Empty question field")
        return;
    }
        
    console.log("Question:", question);
    
    const requestBody = JSON.stringify({html: pageText, question: question});
    console.log("Sending request on server...");

    toggleVisibility();
    const response = await sendServerRequest(requestBody);
    toggleVisibility();
    handleResponse(response);
}
document.getElementById("question-form").addEventListener('submit', submitQuestion);