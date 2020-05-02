class Dice{

    roll(browserManager, numberOfDice, diceKind, mod){
        var self = this;
        function onError(error) {
            self.useLocalDice();
            console.error(`Error: ${error}`);
        }
        
        function onGot(item) {
            if (item.webhookUrl) {
                try{
                    self.useDiceParserOnDiscord(numberOfDice, diceKind, mod, item.webhookUrl, browserManager.getXHRRequest());
                }
                catch(e)
                {
                    self.useLocalDice(numberOfDice, diceKind, mod);
                    console.error(e);
                }                    
            }
            else{
                self.useLocalDice(numberOfDice, diceKind, mod);
            }
        }
        
        browserManager.storageSyncGet("webhookUrl", onGot, onError);
    }

    useDiceParserOnDiscord(numberOfDice, diceKind, mod, webhookUrl, request){
        var characterName = document.querySelector(".ct-character-tidbits__name").innerText;
    
        var str = document.querySelector(".ct-character-tidbits__avatar").style.backgroundImage;
        var patt = new RegExp("https.*[png]");
        var extractUrls = patt.exec(str);
        var avatarUrl = extractUrls !== null && extractUrls.length === 1 ? patt.exec(str)[0] : "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
        
        request.open("POST", webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');
    
        var diceParserCmd = "!"+numberOfDice+"d"+diceKind;
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
    
    useLocalDice(numberOfDice, diceKind, mod){
        // On renvoie un entier aléatoire entre une valeur min (incluse)
        // et une valeur max (incluse).
        // Attention : si on utilisait Math.round(), on aurait une distribution
        // non uniforme !
        var min = Math.ceil(1);
        var max = Math.floor(diceKind);

        var diceFormula = "";
        var diceValueTotal = 0;
        for(var i=0; i<numberOfDice;i++){
            var diceValue = Math.floor(Math.random() * (max - min +1)) + min;

            diceFormula += ("(1d"+diceKind+" : "+diceValue+") + ");
            diceValueTotal += diceValue;
        }

        if(!mod)
            mod = "0";

        diceValueTotal += parseInt(mod);
        alert(diceFormula + "(mod: "+mod+") = " + diceValueTotal);
    }
}