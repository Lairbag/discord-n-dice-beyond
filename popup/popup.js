var browserManager = new BrowserManagerFactory().manager;
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

function saveOptions(e) {
  console.log('saveOptions');
  var urlToSave = document.querySelector("#webhookUrl").value;
  var selectedDiceMode = document.querySelector("[name='diceMode']").value;

  console.log('urlToSave: '+urlToSave);
  console.log('selectedDiceMode: '+selectedDiceMode);

  if(urlToSave !== null)
    urlToSave = urlToSave.trim();
  var startUrl = "https://discordapp.com/api/webhooks/";

  if(urlToSave !== null && urlToSave.length > 0 && !urlToSave.startsWith(startUrl)){
    alert('WebhookUrl doit commencer par '+startUrl);
  }
  else{    
    e.preventDefault();

    var selectedDiceMode = document.querySelector("[name='diceMode']:checked").value;
    if(urlToSave === "")
      selectedDiceMode = "localOnly";

    browserManager.storageSyncSet({webhookUrl: urlToSave, diceMode: selectedDiceMode});
    
    alert("Merci d'actualiser D&DBeyond.");
    window.close();
  }    
}

function restoreOptions() {
  function setCurrentChoiceWebhookUrl(result) {
    if(!result.webhookUrl)
      result.webhookUrl = "";

    document.querySelector("#webhookUrl").value = result.webhookUrl;
    browserManager.storageSyncGet("diceMode", setCurrentChoiceDiceMode, onError);
  }

  function setCurrentChoiceDiceMode(result) {
    if(!result.diceMode){
      if(document.querySelector("#webhookUrl").value.length > 0)
        result.diceMode = "withDiscordAndDiceParser";
      else
        result.diceMode = "localOnly";
    }

    document.querySelector("#"+result.diceMode).checked  = true;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  browserManager.storageSyncGet("webhookUrl", setCurrentChoiceWebhookUrl, onError);  
}
