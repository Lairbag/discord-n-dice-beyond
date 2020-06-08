document.addEventListener('DOMContentLoaded', initDiscordNDiceBeyond());

function initDiscordNDiceBeyond(){
  
    insertStyle();

    var millisecondsToWait = 1000;
    setTimeout(function() {
        var skillsLoaded = document.querySelectorAll("[class*='-signed-number']").length > 0;
        if(skillsLoaded)
        {
            var browserManager = new BrowserManagerFactory().manager;
            addMoreDiceModal(browserManager);
            addDice(browserManager);
        }
        else{
            console.log("D&D beyond is still loading, can't load dice.")
            initDiscordNDiceBeyond();
        }
    }, millisecondsToWait);
}

function insertStyle(){
    var style = "<style>"
    + ".mainDiceContainer { cursor: pointer; position: fixed; right: 5px; z-index: 60002;opacity: 45%; }"
    + ".mainDiceContainer:hover { opacity: 100%; }"

    + ".moreDiceContainer {opacity: 100%; width: 25px; height: 25px; position: fixed; right: 45px; z-index: 60002;}"
    + ".moreDiceContainer:hover {opacity: 100%;}"
    
    + ".moreDice {float: left; height: 24px; width: 24px; border-radius: 5px; cursor: pointer; z-index: 60003; text-align: center;font-size: 18px; background-color: lightgrey; color: grey}"
    + ".moreDice:hover {border: 2px solid grey; height: 27px; width: 27px;}"
    
    + ".damageDice { cursor: pointer; display: inline-block; }"
    + ".shortRestDice { cursor: pointer; display: inline-block; }"
    + ".skillDice { cursor: pointer; }"
    
    + "#modalMoreDice {display: none; position: fixed; top: 20%; left: 25%; background: #26282a; padding: 8px; border-radius: 5px; border: 1px solid black; z-index: 60003}"
    + "#modalMoreDice h2 {font-size: 20px; color: white}"
    + "#modalMoreDice label {display: inline-block}"
    + "#modalMoreDice input[type=radio] {display: none}"
    + "#modalMoreDice input[type=number] {width: 50px}"
    + "#modalMoreDice input{margin: 5px}"
    + "#modalMoreDice .rollDetail {display: inline-block; padding: 10px}"
    + "#modalMoreDice img {opacity: 25%}"
    + "#modalMoreDice img:hover {cursor: pointer; opacity: 100%}"
    + "#modalMoreDice input:checked + label img {opacity: 100%}"
    + "#modalMoreDice .actions {margin: 5px; text-align: center}"
    + "#moreDiceOverlay {display: none; background: grey; height: 100%; position: fixed; top: 0; width: 100%; z-index: 60002; opacity: 0.95;}"
    + "</style>";
    document.querySelector("body").insertAdjacentHTML("beforeend", style); 
}

function addMoreDiceModal(browserManager){    
    var modalHtml = '<div id="moreDiceOverlay"></div><div id="modalMoreDice">'
    +'<div>'
    +'<h2>Type de dés</h2>'
    +'<input type="radio" id="diceKindD100" name="diceKind" value="100"><label for="diceKindD100"><img src="'+getDiceIconUrl(browserManager, 100, "48")+'" alt="Sélectionner le D100"/></label>'
    +'<input type="radio" id="diceKindD20" name="diceKind" value="20" checked><label for="diceKindD20"><img src="'+getDiceIconUrl(browserManager, 20, "48")+'" alt="Sélectionner le D20"/></label>'
    +'<input type="radio" id="diceKindD12" name="diceKind" value="12"><label for="diceKindD12"><img src="'+getDiceIconUrl(browserManager, 12, "48")+'" alt="Sélectionner le D12"/></label>'
    +'<input type="radio" id="diceKindD10" name="diceKind" value="10"><label for="diceKindD10"><img src="'+getDiceIconUrl(browserManager, 10, "48")+'" alt="Sélectionner le D10"/></label>'
    +'<input type="radio" id="diceKindD8" name="diceKind" value="8"><label for="diceKindD8"><img src="'+getDiceIconUrl(browserManager, 8, "48")+'" alt="Sélectionner le D8"/></label>'
    +'<input type="radio" id="diceKindD6" name="diceKind" value="6"><label for="diceKindD6"><img src="'+getDiceIconUrl(browserManager, 6, "48")+'" alt="Sélectionner le D6"/></label>'
    +'<input type="radio" id="diceKindD4" name="diceKind" value="4"><label for="diceKindD4"><img src="'+getDiceIconUrl(browserManager, 4, "48")+'" alt="Sélectionner le D4"/></label>'
    +'</div>'

    +'<div class="rollDetail">'
    +'<h2>Nombre de dés</h2>'
    +'<input type="number" id="nbDice" min="1" value="2" />'
    +'</div>'

    +'<div class="rollDetail">'
    +'<h2>Modificateur</h2>'
    +'<select name="modSign" id="modSign"><option value="+" selected>+</option><option value="-">-</option></select>'
    +'<input type="number" id="modValue" min="0" value="0" />'
    +'</div>'

    +'<div class="actions">'
    +'<input type="button" id="rollMoreDice" value="Lancer les dés" />'
    +'<input type="button" id="closeRollMoreDice" value="Fermer la fenêtre" />'
    +'</div>'

    +'</div>';
    
    document.querySelector("body").insertAdjacentHTML("beforeend", modalHtml); 

    document.querySelector("#rollMoreDice").onclick = function(e){
        var numberOfDice = document.querySelector("#nbDice").value;
        var diceKind = document.querySelector("#modalMoreDice input:checked").value;
        var mod = document.querySelector("#modSign").value + document.querySelector("#modValue").value;

        var dice = new Dice();
        dice.roll(browserManager, numberOfDice, diceKind, mod);

        hideMoreDiceModal();
    };
    
    document.querySelector("#closeRollMoreDice").onclick = function(e){
        hideMoreDiceModal();
    };

    function hideMoreDiceModal(){
        document.querySelector("#moreDiceOverlay").style = "display: none";
        document.querySelector("#modalMoreDice").style = "display: none";
    }
}

function addDice(browserManager){    
    var dice = new Dice();
    window.onresize = function(){
        
        document.querySelectorAll(".mainDiceContainer").forEach(element => {
            element.remove();
        });

        addAllMainDice(browserManager, dice);
        addSkillDice(browserManager, dice);
        addDamageDice(browserManager, dice);
    }

    var millisecondsToWait = 300;

    setTimeout(function() {      
        addAllMainDice(browserManager, dice);
        addSkillDice(browserManager, dice);
        addDamageDice(browserManager, dice);
    }, millisecondsToWait);

    document.querySelector("body").onclick = function(){
        setTimeout(function() {      
            addSkillDice(browserManager, dice);
            addDamageDice(browserManager, dice);
        }, millisecondsToWait);
    }

    document.querySelector("[class*='--short-rest'] div").onclick = function(){
        setTimeout(function() {                
            addShortRestDice(browserManager, dice);
        }, millisecondsToWait);    
    };
}

function addSkillDice(browserManager, dice){
    var iconUrl = browserManager.extensionGetUrl("./icons/d20-16.png");    
    var i =0;

    document.querySelectorAll("[class*='-signed-number']").forEach(element => {
        var skillMod = "";
        element.childNodes.forEach(child =>{
            if(child.innerText)
                skillMod += child.innerText;
        });      

        if(skillMod !==""){
            var id = "diceButton_skill_"+(i++);
            addDiceButtonToDom(iconUrl, id, "Roll the skill dice !", element, "", "skillDice", true, browserManager, dice, 1, 20, skillMod, null);
        }    
    });
}

function addShortRestDice(browserManager, dice){    
    var i =0;
    document.querySelectorAll("[class*='-reset-pane__hitdie-heading']").forEach(element => {
        var extractDiceArray = element.innerHTML.match("[0-9]*d[0-9]*[+-][0-9]*");
        var shortRestDice = extractDiceArray && extractDiceArray.length == 1 ? extractDiceArray[0] : null;
        if(shortRestDice)
        {         
            try{
                var numberOfDice = 1;
                patt = new RegExp("^[0-9]*");
                if(patt.test(shortRestDice)){
                    numberOfDice = patt.exec(shortRestDice)[0];
                }
    
                patt = new RegExp("d[0-9]*");
                var diceKind = parseInt(patt.exec(shortRestDice)[0].substr(1));
    
                var mod = "";
                patt = new RegExp("[+-][0-9]*");
                if(patt.test(shortRestDice)){
                    mod = patt.exec(shortRestDice);
                }
                
                var id = "diceButton_shortRest_"+(i++);
                var iconUrl = getDiceIconUrl(browserManager, diceKind, "32")
                addDiceButtonToDom(iconUrl, id, "Roll the short rest dice !", element, "", "shortRestDice", false, browserManager, dice, numberOfDice, diceKind, mod, null);
            }   
            catch(e)
            {
                console.error(e);
            }            
        }          
    });
}

function addDamageDice(browserManager, dice){
    var i =0;
    document.querySelectorAll("[class*='-combat-attack__damage']").forEach(element => {
        element.style.width = "100px";
    });
    document.querySelectorAll("[class*='-damage__value']").forEach(element => {
        var patt = new RegExp("^[0-9]*d[0-9]*[+-][0-9]*");
        if(patt.test(element.innerHTML))
        {         
            try{
                var numberOfDice = 1;
                patt = new RegExp("^[0-9]*");
                if(patt.test(element.innerHTML)){
                    numberOfDice = patt.exec(element.innerHTML)[0];
                }
    
                patt = new RegExp("d[0-9]*");
                var diceKind = parseInt(patt.exec(element.innerHTML)[0].substr(1));
    
                var mod = "";
                patt = new RegExp("[+-][0-9]*");
                if(patt.test(element.innerHTML)){
                    mod = patt.exec(element.innerHTML);
                }
                
                var id = "diceButton_damage_"+(i++);
                var iconUrl = getDiceIconUrl(browserManager, diceKind, "16");
                addDiceButtonToDom(iconUrl, id, "Roll the damage dice !", element, "", "damageDice", true, browserManager, dice, numberOfDice, diceKind, mod, null);
            }   
            catch(e)
            {
                console.error(e);
            }            
        }          
    });
}

function addAllMainDice(browserManager, dice){            
    var parent = document.querySelector("#site-main");

    var offsetMobileMenu = document.querySelector('body').clientWidth < 1005 ? 50 : 0;

    addMainDice(100, 5+offsetMobileMenu, browserManager, dice, parent);
    addMainDice(20, 55+offsetMobileMenu, browserManager, dice, parent);
    addMainDice(12, 105+offsetMobileMenu, browserManager, dice, parent);
    addMainDice(10, 155+offsetMobileMenu, browserManager, dice, parent);
    addMainDice(8, 205+offsetMobileMenu, browserManager, dice, parent);
    addMainDice(6, 255+offsetMobileMenu, browserManager, dice, parent);
    addMainDice(4, 305+offsetMobileMenu, browserManager, dice, parent);
}

function addMainDice(diceKind, bottomPosition, browserManager, dice, parent){
    var iconUrl = getDiceIconUrl(browserManager, diceKind, "48");
    var style = "bottom: "+bottomPosition+"px;";
    addDiceButtonToDom(iconUrl, "mainD"+diceKind+"Button", "Roll it !", parent, style, "mainDiceContainer", false, browserManager, dice, 1, diceKind, null, "diceKindD"+diceKind);
}

function addDiceButtonToDom(iconUrl, id, alt, parent, style, className, shouldHideSideBar, browserManager, dice, numberOfDice, diceKind, mod, moreDiceId){
    var self = this;
    self.hideSidebar = function(){
        var sideBar = document.querySelector('[data-original-title="Hide Sidebar"]');
        if(sideBar)
        {
            sideBar.click();
        }
        else{
            var millisecondsToWait = 800;
            setTimeout(function() {
                hideSidebar();
            }, millisecondsToWait);
        }
    }

    if(document.querySelector("#"+id) === null){
        var htmlButton = '<div class="'+className+'" id="'+id+'" style="'+style+'"><img src="'+iconUrl+'" alt="'+alt+'"></img><div>';
        if(moreDiceId)
            htmlButton += '<div style="'+style+'" class="moreDiceContainer"><div class="moreDice">+</div></div>';

        parent.insertAdjacentHTML("beforeend", htmlButton); 

        document.querySelector("#"+id+" img").onclick = function(e){
            if(shouldHideSideBar)
                self.hideSidebar();
            dice.roll(browserManager, numberOfDice, diceKind, mod);
            event.stopPropagation();
        };

        if(moreDiceId)
            document.querySelector("#"+id+" .moreDice").onclick = function(e){
                document.querySelector("#"+moreDiceId).checked = true;
                document.querySelector("#moreDiceOverlay").style = "display: block;";
                
                document.querySelector("#modalMoreDice").style = "display:block;left:25%";
                var position = (document.querySelector("body").clientWidth/2) - (document.querySelector('#modalMoreDice').clientWidth/2);
                document.querySelector("#modalMoreDice").style = "display:block;left:"+position+"px";

            };
    }
}

function getDiceIconUrl(browserManager, diceKind, size){
    var iconD100 = browserManager.extensionGetUrl("./icons/d100-"+size+".png");
    var iconD20 = browserManager.extensionGetUrl("./icons/d20-"+size+".png");
    var iconD12 = browserManager.extensionGetUrl("./icons/d12-"+size+".png");
    var iconD10 = browserManager.extensionGetUrl("./icons/d10-"+size+".png");
    var iconD8 = browserManager.extensionGetUrl("./icons/d8-"+size+".png");
    var iconD6 = browserManager.extensionGetUrl("./icons/d6-"+size+".png");
    var iconD4 = browserManager.extensionGetUrl("./icons/d4-"+size+".png");
    
    switch(diceKind)
    {
        case 100:
            return iconD100;
        case 12:
            return iconD12;
        case 10:
            return iconD10;
        case 8:
            return iconD8;
        case 6:
            return iconD6;
        case 4:
            return iconD4;
        case 20:
        default:
            return iconD20;        
    }
}