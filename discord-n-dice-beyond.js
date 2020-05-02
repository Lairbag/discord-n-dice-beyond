document.addEventListener('DOMContentLoaded', initDiscordNDiceBeyond());

function initDiscordNDiceBeyond(){
  
    var millisecondsToWait = 3000;
    setTimeout(function() {
        var skillsLoaded = document.querySelectorAll(".ct-signed-number").length > 0;
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
}

function addSkillDice(browserManager, dice){
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

    var diceIconUrl = browserManager.extensionGetUrl("./icons/d20-16.png");    
    var i =0;
    document.querySelectorAll(".ct-signed-number").forEach(element => {
        var skillMod = "";
        element.childNodes.forEach(child =>{
            skillMod += child.innerText;
        });

        var id = "diceButton_skill_"+(i++);   
        if(document.querySelector("#"+id) === null){
            var htmlButton = '<div id="'+id+'" style="cursor: pointer; z-index 60002"><img src="'+diceIconUrl+'" alt="Roll the skill die"></img></div>';

            element.insertAdjacentHTML("beforeend", htmlButton); 
    
            document.querySelector("#"+id).onclick = function(e){
                self.hideSidebar();
                
                dice.roll(browserManager, 1, 20, skillMod);
            };
        }        
    });
}

function addDamageDice(browserManager, dice){
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

    var diceIconUrl = browserManager.extensionGetUrl("./icons/d20-16.png");    
    var i =0;
    document.querySelectorAll(".ct-damage__value").forEach(element => {
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
                if(document.querySelector("#"+id) === null){
                    var htmlButton = '<div id="'+id+'" style="cursor: pointer; display: inline-block"><img src="'+diceIconUrl+'" alt="Roll the damage die"></img></div>';
    
                    element.insertAdjacentHTML("beforeend", htmlButton); 
            
                    document.querySelector("#"+id).onclick = function(e){
                        self.hideSidebar();
                        dice.roll(browserManager, numberOfDice, diceKind, mod);
                    };
                }
            }   
            catch(e)
            {
                console.error(e);
            }            
        }          
    });
}

function addMainDie(browserManager, dice){    

    var diceIconUrl = browserManager.extensionGetUrl("./icons/d20-48.png");
    var htmlButton = '<div id="diceButton" style="cursor: pointer; position: fixed; bottom: 5px; left: 5px; z-index 60002"><img src="'+diceIconUrl+'" alt="Roll the dice"></img></div>';
    document.querySelector("#site-main").insertAdjacentHTML("beforeend", htmlButton);

    document.querySelector("#diceButton").onclick = function(e){
        dice.roll(browserManager, 4, 20, null);
    }
}