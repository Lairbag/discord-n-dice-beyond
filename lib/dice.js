class Dice{

    roll(browserManager, mod){
        var self = this;
        function onError(error) {
            self.useLocalDice();
            console.error(`Error: ${error}`);
        }
        
        function onGot(item) {
            if (item.webhookUrl) {
                try{
                    self.useDiceParserOnDiscord(mod, item.webhookUrl, browserManager.getXHRRequest());
                }
                catch(e)
                {
                    self.useLocalDice(mod);
                    console.error(e);
                }                    
            }
            else{
                self.useLocalDice(mod);
            }
        }
        
        browserManager.storageSyncGet("webhookUrl", onGot, onError);
    }

    useDiceParserOnDiscord(mod, webhookUrl, request){
        var characterName = document.querySelector(".ct-character-tidbits__name").innerText;
    
        var str = document.querySelector(".ct-character-tidbits__avatar").style.backgroundImage;
        var patt = new RegExp("https.*[png]");
        var avatarUrl = patt.exec(str)[0];
        
        request.open("POST", webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');
    
        var diceParserCmd = "!1d20";
        if(mod)
            diceParserCmd += mod;
        diceParserCmd += " #"+characterName;
        var params ={
            "content": diceParserCmd,
            "username": characterName,
            "avatar_url": avatarUrl
          };
          
        request.send(JSON.stringify(params));
    }
    
    useLocalDice(mod){
        // On renvoie un entier aléatoire entre une valeur min (incluse)
        // et une valeur max (incluse).
        // Attention : si on utilisait Math.round(), on aurait une distribution
        // non uniforme !
        var min = Math.ceil(1);
        var max = Math.floor(20);

        var diceValue = Math.floor(Math.random() * (max - min +1)) + min;
        
        if(mod){
            var finalResult = diceValue + parseInt(mod);
            alert("(d20: "+diceValue+") + (mod: "+mod+") = " + finalResult);
        }
        else{
            alert(diceValue);   
        }        
    }
}