addButton();

function addButton(){    

    var browserManager = new BrowserManagerFactory().manager;
    var dice = new Dice();

    var diceIconUrl = browserManager.extensionGetUrl("./icons/d20-48.png");
    var htmlButton = '<div id="diceButton" style="cursor: pointer; position: fixed; bottom: 5px; left: 5px; z-index 60002"><img src="'+diceIconUrl+'" alt="Roll the dice"></img></div>';
    document.querySelector("#site-main").insertAdjacentHTML("beforeend", htmlButton);

    document.querySelector("#diceButton").onclick = function(e){
        dice.roll(browserManager);
    }    
}


