class Dice{

    roll(browserManager){
        var self = this;
        function onError(error) {
            self.useLocalDice();
            console.error(`Error: ${error}`);
        }
        
        function onGot(item) {
            if (item.webhookUrl) {
                try{
                    self.useDiceParserOnDiscord(item.webhookUrl, browserManager.getXHRRequest());
                }
                catch(e)
                {
                    self.useLocalDice();
                    console.error(e);
                }                    
            }
            else{
                self.useLocalDice();
            }
        }
        
        browserManager.storageSyncGet("webhookUrl", onGot, onError);
    }

    useDiceParserOnDiscord(webhookUrl, request){
        var characterName = document.querySelector(".ct-character-tidbits__name").innerText;
    
        var str = document.querySelector(".ct-character-tidbits__avatar").style.backgroundImage;
        var patt = new RegExp("https.*[png]");
        var avatarUrl = patt.exec(str)[0];
        
        request.open("POST", webhookUrl);
        request.setRequestHeader('Content-type', 'application/json');
    
        var params ={
            "content": "!1d20 #"+characterName,
            "username": characterName,
            "avatar_url": avatarUrl
          };
          
        request.send(JSON.stringify(params));
    }
    
    useLocalDice(){
        // On renvoie un entier aléatoire entre une valeur min (incluse)
        // et une valeur max (incluse).
        // Attention : si on utilisait Math.round(), on aurait une distribution
        // non uniforme !
        var min = Math.ceil(1);
        var max = Math.floor(20);
        alert(Math.floor(Math.random() * (max - min +1)) + min);
    }
}