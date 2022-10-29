let questionForm = document.getElementById("question-form")


async function submitQuestion(event){    
    event.preventDefault();
    let html = chrome.storage.local.get(["doc"])
    let response = await fetch('https://8sh18d.deta.dev/testing', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: html
    });

    response.json().then(function(data){
            chrome.storage.local.set({IS_BODY_LOADED: true})
            console.log(data);
        }
    );

    let question = questionForm.querySelector("#search-bar-input").value;
}

questionForm.addEventListener('submit', submitQuestion)