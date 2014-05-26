var name = "Presenter";

var peer = new Peer({host: 'it-bejga2.dhbw-stuttgart.de', port: 9000, debug: true});
//var peer = new Peer({
//    // Set API key for cloud server (you don't need this if you're running your
//    // own.
//    key: 'lwjd5qra8257b9',
//
//    // Set highest debug level (log everything!).
//    debug: 3,
//
//    // Set a logging function:
//    logFunction: function () {
//        var copy = Array.prototype.slice.call(arguments).join(' ');
//        console.log(copy);
//    },
//
//    // Use a TURN server for more network support
//    config: {
//        'iceServers': [
//            { url: 'stun:stun.l.google.com:19302' }
//        ]
//    } /* Sample servers, please use appropriate ones */
//});
var connectedPeers = new Array();

// Show this peer's ID.
peer.on('open', function (id) {
    $('#pid').text(id);
});

// Await connections from others
peer.on('connection', connect);

// Handle a connection object.
function connect(c) {
    // Handle a chat connection.
    if (c.label === 'chat') {
        var messages = $('<div><em>' + c.metadata.name + " - " + c.peer + ' joined.</em></div>');

        eachActiveConnection(function (con, $c) {
            if (con.label === 'chat') {
                var message = "{\"flag\": 0, " +
                    "\"content\":\"" + c.peer + "\"," +
                    "\"name\":\"" + c.metadata.name + "\"}";
                con.send(message);
//              $('#messages').append('<div><span class="you">You: </span>' + c.peer + ' Joined</div>');
            }
        });

        connectedPeers.push(c.peer);
        updateConnections();
        // Select connection handler.

        $('.filler').hide();
        $('#messages').append(messages);


        // If a message is received
        c.on('data', function (data) {
            data = jQuery.parseJSON(data);
            onMessageRecieve(c, data);
        });

        // If a Peer leave a message gets shown and he gets removed from the list
        c.on('close', function () {
            $('#messages').append('<div><em>' + c.metadata.name + ' has left the Chat.</em></div>');
            updateConnections();

            if (peer.connections == 'undefined') {
                $('.filler').show();

            }
            delete connectedPeers[c.peer];
        });
    }
}



// Make sure things clean up properly.
// TODO - Make sure if this is really needed, since chrome apps do not support window.onunload and window.onbeforeunload
window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) { // TODO - WTF?? Are you askigng if peer does not not exist AND peer ist not destroyed?
        peer.destroy();
    }
    // Proposal:
    // try{ peer.destroy(); } catch {}
};

function copyPeerIdToClipboard() {
    var peerID = document.getElementById("pid").innerHTML;
    console.log(peerID);
    copyToClipboard(peerID);
}

// TODO - Maybe relocate this to somewhere else als external module
function copyToClipboard( text ){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}

function emailLink(){
    var peerID = document.getElementById("pid").innerHTML;
    var subject = encodeURIComponent("Many Slide Presentation");
    var body = "PeerID = " + encodeURIComponent(peerID);
    body = encodeURIComponent(body);
    var mailToStr = "mailto:?Subject=" + subject + "&Body=" + body;
    console.log(mailToStr);
    tmpMailWindow = window.open(mailToStr);
    // TODO - find a way to close the opened mailto window/tab or use mailto in a different manner 
}


// LAYOUT STUFF

var htmlConnections = "<p id='amount'>Connections: 0</p>" +
    "<div id='connections' >" +
    "<span class='filler'>No Audience yet.</span>" +
    "</div>";
var htmlChat = "<p id='chat'>Chat</p>" +
    "<div id='messages'>" +
    "</div>" +
    "<form id='send'>" +
    "<input type='text' id='text' placeholder='Enter message' class='form-control'>" +
    "<input type='submit' id='btnSend' value='Send' class='btn  btn-lg btn-primary'>" +
    "</form>";
var htmlPresentation =  '<div id="presentationWindow">' +
    '<div id="presentationControlls">'+
    '<span class="fui-arrow-left"></span>'+
    '<span class="fui-arrow-right"></span>'+
    '</div>'+
    '</div>';

$(function () {
    var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
    $('#layout').w2layout({
        name: 'layout',
        panels: [
            { type: 'main', style: pstyle, content: htmlConnections},
            { type: 'preview', size: '75%', resizable: true, style: pstyle, content: htmlChat},
            { type: 'right', size: '75%', resizable: true, style: pstyle, content: htmlPresentation }
        ],
        onRefresh: function(event) {
            sidebarHeight();
        },
        onResize: function(event) {
            var myVar = setInterval(function(){sidebarHeight()},3);
        }
    });
});

$(document).ready(function () {

//    // TODO - is never used, therefore remove if not needed anymore
//    function doNothing(e) {
//        e.preventDefault();
//        e.stopPropagation();
//    }

    $('.rsh').draggable({
        axis: 'y',
        containment: 'parent',
        helper: 'clone',
        drag: (function (event, ui) {
            var height = ui.offset.top;
            $(this).prev().height(height);
        })
    });

    $("#chatWindow").resizable();

    // Button event bindings
    $('#sendDummyPresentation').click(function () {
        sendDummyPresentation();
    });

    $('#CopyPeerIdToClipboard').click(function () {
        copyPeerIdToClipboard();
    });

    $('#emailLink').click(function () {
        emailLink();
    });

    $('#toogleSharing').click(function () {
        toogleSharing();
    });

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
        onMessageSend(e);
    });
});