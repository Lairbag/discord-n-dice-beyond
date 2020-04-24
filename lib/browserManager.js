class ChromiumManager{
    storageSyncGet(key, onGot, onError){
        try{
            chrome.storage.sync.get(key,onGot);
        }catch(e){
            onError();
        }    
    }
    
    storageSyncSet(json){
        chrome.storage.sync.set(json); 
    }
    
    extensionGetUrl(url){
        return chrome.extension.getURL(url);
    }
    
    getXHRRequest(){    
        return new XMLHttpRequest();
    }    
}

class FirefoxManager{
    storageSyncGet(key, onGot, onError){
        var getting = browser.storage.sync.get(key);
        getting.then(onGot, onError);
    }
    
    storageSyncSet(json){
        browser.storage.sync.set(json); 
    }
    
    extensionGetUrl(url){
        return browser.extension.getURL(url);
    }
    
    getXHRRequest(){    
        //https://discourse.mozilla.org/t/webextension-xmlhttprequest-issues-no-cookies-or-referrer-solved/11224/9
        return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
    }
}

class BrowserManagerFactory{
    constructor(){
        if(window.chrome)
            this.manager = new ChromiumManager();
        else
            this.manager = new FirefoxManager();
    }    
}