var browserManager = new BrowserManagerFactory().manager;
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

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
    browserManager.storageSyncSet({webhookUrl: urlToSave});
    //TODO : a automatiser
    alert("Merci d'actualiser D&DBeyond.");
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

  browserManager.storageSyncGet("webhookUrl", setCurrentChoice, onError);
}