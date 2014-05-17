/**
* Listens for the app launching then creates the window
*
* @see http://developer.chrome.com/apps/app.runtime.html
* @see http://developer.chrome.com/apps/app.window.html
*/
chrome.app.runtime.onLaunched.addListener(function(launchData) {
    // Center window on screen.
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;

    var width = 425;
    var height = 725;
    
    chrome.app.window.create('Start/index.html', {
        id: "indexID",
            bounds: {
            width: width,
            height: height,
            left: Math.round((screenWidth-width)/2),
            top: Math.round((screenHeight-height)/2)
        }
    }, function(win) {
        win.contentWindow.launchData = launchData;
    });
});