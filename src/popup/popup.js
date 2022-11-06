async function submitQuestion(event){
    event.preventDefault();

    function getPageHTML(){
        return new Promise((resolve) => {
            chrome.storage.local.get("doc", resolve);
        })
    }

    let html = await getPageHTML();
    let doc = html.doc
    console.log(doc)

    let question = questionForm.querySelector("#search-bar-input").value;
    console.log(question)
   
    let response = await fetch('https://8sh18d.deta.dev/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({text: doc, question: question}) 
        }
    );

    response.json().then(function(data){
            chrome.storage.local.set({IS_BODY_LOADED: true})
            console.log(data);
        }
    );

    
}



let questionForm = document.getElementById("question-form")
questionForm.addEventListener('submit', submitQuestion)