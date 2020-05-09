class Dice{

    roll(browserManager, numberOfDice, diceKind, mod){
        var self = this;
        function onError(error) {            
            console.error(`Error: ${error}`);
            self.displayDiceResultOnBrowser();
        }
        
        function onGot(item) {
            if (item.diceMode && item.diceMode !== "localOnly") {
                try{
                    var shouldUseDiceParser = (item.diceMode === "withDiscordAndDiceParser");
                    var request = browserManager.getXHRRequest();
                    browserManager.storageSyncGet("webhookUrl", 
                    (item2) => {
                        self.useDiscord(numberOfDice, diceKind, mod, item2.webhookUrl, request, shouldUseDiceParser);
                    }, 
                    self.onError);                    
                }
                catch(e)
                {
                    self.displayDiceResultOnBrowser(numberOfDice, diceKind, mod);
                    console.error(e);
                }                    
            }
            else{
                self.displayDiceResultOnBrowser(numberOfDice, diceKind, mod);
            }
        }
        
        browserManager.storageSyncGet("diceMode", onGot, onError);
    }

    useDiscord(numberOfDice, diceKind, mod, webhookUrl, request, shouldUseDiceParser){
        var characterName = document.querySelector("[class*='-character-tidbits__name']").innerText;
    
        var str = document.querySelector("[class*='-character-tidbits__avatar']").style.backgroundImage;
        var patt = new RegExp("https.*[png]");
        var extractUrls = patt.exec(str);
        var avatarUrl = extractUrls !== null && extractUrls.length === 1 ? patt.exec(str)[0] : "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
        
        var content = "";
        if(shouldUseDiceParser){
            var content = "!"+numberOfDice+"d"+diceKind;
            if(mod)
                content += mod;
            content += " #"+characterName;    
        }
        else{
            content = this.rollLocalDice(numberOfDice, diceKind, mod);
        }
        
        this.displayDiceResultOnDiscord(content, characterName, avatarUrl, webhookUrl, request);
    }

    rollLocalDice(numberOfDice, diceKind, mod){
        // On renvoie un entier aléatoire entre une valeur min (incluse)
        // et une valeur max (incluse).
        // Attention : si on utilisait Math.round(), on aurait une distribution
        // non uniforme !
        var min = Math.ceil(1);
        var max = Math.floor(diceKind);

        var diceFormula = "";
        var diceValueTotal = 0;
        var i=0;
        for(i; i<numberOfDice;i++){
            var diceValue = Math.floor(Math.random() * (max - min +1)) + min;

            diceFormula += (diceValue+" + ");
            diceValueTotal += diceValue;
        }
        
        if(i=1 && !mod)
            return diceValueTotal;

        if(!mod)
            mod = "0";

        diceValueTotal += parseInt(mod);

        return (diceFormula + "(mod: "+mod+") = " + diceValueTotal);
    }

    displayDiceResultOnDiscord(content, characterName, avatarUrl, webhookUrl, request){
        request.open("POST", webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');
     
        var params ={
            "content": content,
            "username": characterName,
            "avatar_url": avatarUrl
          };
          
        request.send(JSON.stringify(params));
    }

    displayDiceResultOnBrowser(numberOfDice, diceKind, mod){
        alert(this.rollLocalDice(numberOfDice, diceKind, mod));
    }
}