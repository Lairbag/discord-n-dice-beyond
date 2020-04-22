function addButton(){    
    var diceIconUrl = getBrowserNamespace().extension.getURL("icons/d20-48.png");
    var htmlButton = '<div id="diceButton" style="cursor: pointer; position: fixed; bottom: 5px; left: 5px; z-index 60002"><img src="'+diceIconUrl+'" alt="Roll the dice"></img></div>';
    document.getElementById("site-main").insertAdjacentHTML("beforeend", htmlButton);

    document.getElementById('diceButton').onclick = function(e){
        
        function onError(error) {
            useLocalDice();
            console.log(`Error: ${error}`);
        }
        
        function onGot(item) {
            if (item.webhookUrl) {
                try{
                    useDiceParserOnDiscord(item.webhookUrl);
                }
                catch(e)
                {
                    useLocalDice();
                    console.error(e);
                }                    
            }
            else{
                useLocalDice();
            }
        }
        
        storageSyncGet("webhookUrl", onGot, onError);
    }

    function useDiceParserOnDiscord(webhookUrl){
        var characterName = document.getElementsByClassName("ct-character-tidbits__name")[0].innerText;
    
        var str = document.getElementsByClassName("ct-character-tidbits__avatar")[0].style.backgroundImage;
        var patt = new RegExp("https.*[png]");
        var avatarUrl = patt.exec(str)[0];
        
        var request = getXHRRequest();
        request.open("POST", webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');

        var params ={
            "content": "!1d20 #"+characterName,
            "username": characterName,
            "avatar_url": avatarUrl
          };
          
        request.send(JSON.stringify(params));
    }

    function useLocalDice(){
        // On renvoie un entier aléatoire entre une valeur min (incluse)
        // et une valeur max (incluse).
        // Attention : si on utilisait Math.round(), on aurait une distribution
        // non uniforme !
        var min = Math.ceil(1);
        var max = Math.floor(20);
        alert(Math.floor(Math.random() * (max - min +1)) + min);
    }
}

function getXHRRequest(){    
    if(window.chrome)
        return new XMLHttpRequest();

    //https://discourse.mozilla.org/t/webextension-xmlhttprequest-issues-no-cookies-or-referrer-solved/11224/9
    return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
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

//document.body.style.border = "5px solid red";
addButton();