function saveOptions(e) {

    var urlToSave = document.querySelector("#webhookUrl").value;
    if(urlToSave !== null)
        urlToSave = urlToSave.trim();
    var startUrl = "https://discordapp.com/api/webhooks/";

    if(urlToSave !== null && urlToSave.length > 0 && !urlToSave.startsWith(startUrl)){
        alert('WebhookUrl doit commencer par '+startUrl);
    }
    else{
        e.preventDefault();
        getBrowserNamespace().storage.sync.set({
            webhookUrl: urlToSave
        });

        //TODO : a automatiser
        alert('Vous pouvez actualiser la fenêtre D&D Beyond pour prendre en compte les changements.');
        window.close();
    }    
  }
  
  function restoreOptions() {
  
    function setCurrentChoice(result) {
      if(!result.webhookUrl)
        result.webhookUrl = "";
      document.querySelector("#webhookUrl").value = result.webhookUrl;
    }
  
    function onError(error) {
      console.log(`Error: ${error}`);
    }
  
    storageSyncGet("webhookUrl", setCurrentChoice, onError);
  }

  function getBrowserNamespace(){
    if(window.chrome)
        return chrome;

    return browser;
  }
  
  function storageSyncGet(key, onGot, onError){
    if(window.chrome){
        chrome.storage.sync.get(key,onGot);
    }
    else{
        var getting = browser.storage.sync.get(key);
        getting.then(onGot, onError);
    }    
}

  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);