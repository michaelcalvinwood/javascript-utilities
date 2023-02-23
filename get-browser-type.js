function getBrowserType(){         
    let userAgent = navigator.userAgent;
    let browserType;
    
    if(userAgent.match(/chrome|chromium|crios/i)){
        browserType = "chrome";
    }else if(userAgent.match(/firefox|fxios/i)){
        browserType = "firefox";
    }  else if(userAgent.match(/safari/i)){
        browserType = "safari";
    }else if(userAgent.match(/opr\//i)){
        browserType = "opera";
    } else if(userAgent.match(/edg/i)){
        browserType = "edge";
    }else{
        browserType="unknown";
    }
    
   return browserType;
}
