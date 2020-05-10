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
    + ".skillDice { cursor: pointer; z-index: 60002 }"
    + "</style>"
    document.querySelector("body").insertAdjacentHTML("beforeend", style); 
}

function addDice(){
    var browserManager = new BrowserManagerFactory().manager;
    var dice = new Dice();

    addAllMainDice(browserManager, dice);
    addSkillDice(browserManager, dice);
    adddamageDice(browserManager, dice);

    window.onresize = function(){
        addSkillDice(browserManager, dice);
        adddamageDice(browserManager, dice);
    }

    var actionsTab = document.querySelector("[class*='-primary-box__tab--actions']");
    var optionsTab = document.querySelectorAll("[class*='-tab-options__header']");
    if(actionsTab){
        actionsTab.onclick = function(){
            setTimeout(function() {
                
                adddamageDice(browserManager, dice);
                if(optionsTab){
                    optionsTab.forEach(element => {  
                        element.onclick = function(){
                            setTimeout(function() {
                                adddamageDice(browserManager, dice);
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
                    adddamageDice(browserManager, dice);
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

function adddamageDice(browserManager, dice){    
    var iconD20 = browserManager.extensionGetUrl("./icons/d20-16.png");
    var iconD12 = browserManager.extensionGetUrl("./icons/d12-16.png");
    var iconD10 = browserManager.extensionGetUrl("./icons/d10-16.png");
    var iconD8 = browserManager.extensionGetUrl("./icons/d8-16.png");
    var iconD6 = browserManager.extensionGetUrl("./icons/d6-16.png");
    var iconD4 = browserManager.extensionGetUrl("./icons/d4-16.png");

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
                var iconUrl = null;
                switch(diceKind)
                {

                    case 12:
                        iconUrl = iconD12;
                        break;
                    case 10:
                        iconUrl = iconD10;
                        break;
                    case 8:
                        iconUrl = iconD8;
                        break;
                    case 6:
                        iconUrl = iconD6;
                        break;
                    case 4:
                        iconUrl = iconD4;
                        break;
                    case 20:
                    default:
                        iconUrl = iconD20;
                        break;
                    
                }
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

    addMainDice(20, 5, browserManager, dice, parent);
    addMainDice(12, 55, browserManager, dice, parent);
    addMainDice(10, 105, browserManager, dice, parent);
    addMainDice(8, 155, browserManager, dice, parent);
    addMainDice(6, 205, browserManager, dice, parent);
    addMainDice(4, 255, browserManager, dice, parent);
}

function addMainDice(diceKind, bottomPosition, browserManager, dice, parent){
    var iconUrl = browserManager.extensionGetUrl("./icons/d"+diceKind+"-48.png");
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