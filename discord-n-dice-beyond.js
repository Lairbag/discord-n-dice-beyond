document.addEventListener('DOMContentLoaded', initDiscordNDiceBeyond());

function initDiscordNDiceBeyond(){
  
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

function addDice(){
    var browserManager = new BrowserManagerFactory().manager;
    var dice = new Dice();

    addMainDie(browserManager, dice);
    addSkillDice(browserManager, dice);
    addDamageDice(browserManager, dice);

    window.onresize = function(){
        addSkillDice(browserManager, dice);
        addDamageDice(browserManager, dice);
    }

    document.querySelector("[class*='-primary-box__tab--actions']").onclick = function(){
        setTimeout(function() {
            
            addDamageDice(browserManager, dice);
            document.querySelectorAll("[class*='-tab-options__header']").forEach(element => {  
                element.onclick = function(){
                    setTimeout(function() {
                        addDamageDice(browserManager, dice);
                    }, 1000);            
                }
            });

        }, 1000);     
    };

    document.querySelectorAll("[class*='-tab-options__header']").forEach(element => {  
        element.onclick = function(){
            setTimeout(function() {
                addDamageDice(browserManager, dice);
            }, 1000);            
        }
    });
}

function addSkillDice(browserManager, dice){
    var iconUrl = browserManager.extensionGetUrl("./icons/d20-16.png");    
    var style = "cursor: pointer; z-index 60002";
    var i =0;
    var patt = new RegExp("^[0-9]*");
    document.querySelectorAll("[class*='-signed-number']").forEach(element => {
        var skillMod = "";
        element.childNodes.forEach(child =>{
            if(patt.test(child.innerText)){
                skillMod += patt.exec(child.innerText)[0];
            }
        });      

        if(skillMod !==""){
            var id = "diceButton_skill_"+(i++);   
            addDiceButtonToDom(iconUrl, id, "Roll the skill dice !", element, style, true, browserManager, dice, 1, 20, skillMod);
        }        
    });
}

function addDamageDice(browserManager, dice){    
    var iconUrl = browserManager.extensionGetUrl("./icons/d20-16.png");  
    var style = "cursor: pointer; display: inline-block";

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
                addDiceButtonToDom(iconUrl, id, "Roll the damage dice !", element, style, true, browserManager, dice, numberOfDice, diceKind, mod);
            }   
            catch(e)
            {
                console.error(e);
            }            
        }          
    });
}

function addMainDie(browserManager, dice){    
    var iconUrl = browserManager.extensionGetUrl("./icons/d20-48.png");
    var parent = document.querySelector("#site-main");
    var style = "cursor: pointer; position: fixed; bottom: 5px; left: 5px; z-index 60002";

    addDiceButtonToDom(iconUrl, "mainDieButton", "Roll it !", parent, style, false, browserManager, dice, 1, 20, null);
}

function addDiceButtonToDom(iconUrl, id, alt, parent, style, shouldHideSideBar, browserManager, dice, numberOfDice, diceKind, mod){
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
        var htmlButton = '<div id="'+id+'" style="'+style+'"><img src="'+iconUrl+'" alt="'+alt+'"></img></div>';

        parent.insertAdjacentHTML("beforeend", htmlButton); 

        document.querySelector("#"+id).onclick = function(e){
            if(shouldHideSideBar)
                self.hideSidebar();
            dice.roll(browserManager, numberOfDice, diceKind, mod);
        };
    }
}