document.addEventListener('DOMContentLoaded', initDiscordNDiceBeyond());

function initDiscordNDiceBeyond(){
  
    insertStyle();

    var millisecondsToWait = 3000;
    setTimeout(function() {
        var skillsLoaded = document.querySelectorAll("[class*='-signed-number']").length > 0;
        if(skillsLoaded)
        {
            addDice();
        }
        else{
            console.log("D&D beyond is still loading, can't load dice.")
            initDiscordNDiceBeyond();
        }
    }, millisecondsToWait);
}

function insertStyle(){
    var style = "<style>"
    + ".mainDiceContainer { cursor: pointer; position: fixed;left: 5px; z-index: 60002;opacity: 45%; }"
    + ".mainDiceContainer:hover { opacity: 100%; }"
    + ".damageDice { cursor: pointer; display: inline-block; }"
    + ".shortRestDice { cursor: pointer; display: inline-block; }"
    + ".skillDice { cursor: pointer; }"
    + "</style>"
    document.querySelector("body").insertAdjacentHTML("beforeend", style); 
}

function addDice(){
    var browserManager = new BrowserManagerFactory().manager;
    var dice = new Dice();

    addAllMainDice(browserManager, dice);
    addSkillDice(browserManager, dice);
    addDamageDice(browserManager, dice);

    window.onresize = function(){
        addSkillDice(browserManager, dice);
        addDamageDice(browserManager, dice);
    }

    document.querySelector("[class*='--short-rest'] div").onclick = function(){
        setTimeout(function() {                
            addShortRestDice(browserManager, dice);
        }, 1000);    
    };

    var actionsTab = document.querySelector("[class*='-primary-box__tab--actions']");
    var optionsTab = document.querySelectorAll("[class*='-tab-options__header']");
    if(actionsTab){
        actionsTab.onclick = function(){
            setTimeout(function() {
                
                addDamageDice(browserManager, dice);
                if(optionsTab){
                    optionsTab.forEach(element => {  
                        element.onclick = function(){
                            setTimeout(function() {
                                addDamageDice(browserManager, dice);
                            }, 1000);            
                        }
                    });
                }
    
            }, 1000);     
        };
    }

    if(optionsTab){
        optionsTab.forEach(element => {  
            element.onclick = function(){
                setTimeout(function() {
                    addDamageDice(browserManager, dice);
                }, 1000);            
            }
        });
    }
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
            addDiceButtonToDom(iconUrl, id, "Roll the skill dice !", element, "", "skillDice", true, browserManager, dice, 1, 20, skillMod);
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
                addDiceButtonToDom(iconUrl, id, "Roll the short rest dice !", element, "", "shortRestDice", false, browserManager, dice, numberOfDice, diceKind, mod);
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
                addDiceButtonToDom(iconUrl, id, "Roll the damage dice !", element, "", "damageDice", true, browserManager, dice, numberOfDice, diceKind, mod);
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
    addMainDice(100, 5, browserManager, dice, parent);
    addMainDice(20, 55, browserManager, dice, parent);
    addMainDice(12, 105, browserManager, dice, parent);
    addMainDice(10, 155, browserManager, dice, parent);
    addMainDice(8, 205, browserManager, dice, parent);
    addMainDice(6, 255, browserManager, dice, parent);
    addMainDice(4, 305, browserManager, dice, parent);
}

function addMainDice(diceKind, bottomPosition, browserManager, dice, parent){
    var iconUrl = getDiceIconUrl(browserManager, diceKind, "48");
    var style = "bottom: "+bottomPosition+"px;";
    addDiceButtonToDom(iconUrl, "mainD"+diceKind+"Button", "Roll it !", parent, style, "mainDiceContainer", false, browserManager, dice, 1, diceKind, null);
}

function addDiceButtonToDom(iconUrl, id, alt, parent, style, className, shouldHideSideBar, browserManager, dice, numberOfDice, diceKind, mod){
    var self = this;
    self.hideSidebar = function(){
        var sideBar = document.querySelector('[data-original-title="Hide Sidebar"]');
        if(sideBar)
        {
            sideBar.click();
        }
        else{
            var millisecondsToWait = 1000;
            setTimeout(function() {
                hideSidebar();
            }, millisecondsToWait);
        }
    }

    if(document.querySelector("#"+id) === null){
        var htmlButton = '<div class="'+className+'" id="'+id+'" style="'+style+'"><img src="'+iconUrl+'" alt="'+alt+'"></img></div>';

        parent.insertAdjacentHTML("beforeend", htmlButton); 

        document.querySelector("#"+id).onclick = function(e){
            if(shouldHideSideBar)
                self.hideSidebar();
            dice.roll(browserManager, numberOfDice, diceKind, mod);
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