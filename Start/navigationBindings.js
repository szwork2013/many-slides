$('#editor-btn').click(function () {
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    
    var width = 1125;
    var height = 775;
    
    chrome.app.window.create('Editor/index.html', {
        id: "EditorID",
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

$('#presenter-btn').click(function () {
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    
    var width = 1125;
    var height = 775;
    
    chrome.app.window.create('Theater/presenterMode.html', {
        id: "PresenterID",
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

$('#theater-btn').click(function () {
    var screenWidth = screen.availWidth;
    var screenHeight = screen.availHeight;
    
    var width = 1125;
    var height = 775;
    
    chrome.app.window.create('Theater/theaterMode.html', {
        id: "TheaterID",
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