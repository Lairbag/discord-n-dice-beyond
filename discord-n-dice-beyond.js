function addButton(){    
    var diceIconUrl = browser.extension.getURL("icons/d20-48.png");
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
                    console.exception(e);
                }                    
            }
            else{
                useLocalDice();
            }
        }
        
        var getting = browser.storage.sync.get("webhookUrl");
        getting.then(onGot, onError);
    }


    function useDiceParserOnDiscord(webhookUrl){
        var characterName = document.getElementsByClassName("ct-character-tidbits__name")[0].innerText;
    
        var str = document.getElementsByClassName("ct-character-tidbits__avatar")[0].style.backgroundImage;
        var patt = new RegExp("https.*[png]");
        var avatarUrl = patt.exec(str)[0];
        
        //https://discourse.mozilla.org/t/webextension-xmlhttprequest-issues-no-cookies-or-referrer-solved/11224/9
        var request = XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
        request.open("POST", webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');

        var params ={
            "content": "!1d20",
            "username": characterName,
            "avatar_url": avatarUrl
          }
          
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

//document.body.style.border = "5px solid red";
addButton();