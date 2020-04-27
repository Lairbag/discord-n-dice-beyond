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

    window.onresize = function(){console.log("resize");;addSkillDice(browserManager, dice);}
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

        var id = "diceButton_"+(i++);   
        if(document.querySelector("#"+id) === null){
            var htmlButton = '<div id="'+id+'" style="cursor: pointer; z-index 60002"><img src="'+diceIconUrl+'" alt="Roll the dice"></img></div>';

            element.insertAdjacentHTML("beforeend", htmlButton); 
    
            document.querySelector("#"+id).onclick = function(e){
                self.hideSidebar();
                
                dice.roll(browserManager, skillMod);            
                //e.preventDefault();
            };
        }        
    });
}

function addMainDie(browserManager, dice){    

    var diceIconUrl = browserManager.extensionGetUrl("./icons/d20-48.png");
    var htmlButton = '<div id="diceButton" style="cursor: pointer; position: fixed; bottom: 5px; left: 5px; z-index 60002"><img src="'+diceIconUrl+'" alt="Roll the dice"></img></div>';
    document.querySelector("#site-main").insertAdjacentHTML("beforeend", htmlButton);

    document.querySelector("#diceButton").onclick = function(e){
        dice.roll(browserManager, null);
    }
}