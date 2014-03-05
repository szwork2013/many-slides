// Connect to PeerJS, have server assign an ID instead of providing one
// Showing off some of the configs available with PeerJS :).

function shareLink() {
    var peerID = document.getElementById("pid").innerHTML;
    console.log("Sharing Link with ID " + peerID);
    window.open("index.html?&peerID=" + peerID);
}

//---- Kann ausgelagert werden
var peer = new Peer({
    // Set API key for cloud server (you don't need this if you're running your
    // own.
    key: 'lwjd5qra8257b9',

    // Set highest debug level (log everything!).
    debug: 3,

    // Set a logging function:
    logFunction: function () {
        var copy = Array.prototype.slice.call(arguments).join(' ');
        console.log(copy);
    },

    // Use a TURN server for more network support
    config: {
        'iceServers': [
            { url: 'stun:stun.l.google.com:19302' }
        ]
    } /* Sample servers, please use appropriate ones */
});
//---- Kann ausgelagert werden
var connectedPeers = new Array();

// Show this peer's ID.
peer.on('open', function (id) {
    $('#pid').text(id);
});

//---- Kann ausgelagert werden
// Await connections from others
peer.on('connection', connect);

// Handle a connection object.
function connect(c) {
    // Handle a chat connection.
    if (c.label === 'chat') {
//        var messages = $('<div><em>Peer ' + c.peer + ' connected.</em></div>').addClass('messages');

        connectedPeers.push(c.peer);
        $('.filler').hide();
        $('#messages').append(messages);

        c.on('data', function (data) {
            console.log(data);
            data = jQuery.parseJSON(data);
            onMessageRecieve(c,data);
        });
        c.on('close', function () {
            console.log(c.peer + ' has left the chat.');
//            alert(c.peer + ' has left the chat.');
//            chatbox.remove();
            if ($('.connection').length === 0) {
                $('.filler').show();
            }
            delete connectedPeers[c.peer];
        });
    }
}

$(document).ready(function () {

    function doNothing(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Connect to a peer
    $('#connect').click(function () {
        requestedPeer = $('#rid').val();
        if (!connectedPeers[requestedPeer]) {
            // Create new chat connection.
            var c = peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'none',
                reliable: false,
                name: "TEST"
            });
            c.on('open', function () {
                connect(c);
            });
            c.on('error', function (err) {
                alert(err);
            });
        }
        connectedPeers[requestedPeer] = 1;
    });

    //---- is probably not used
    // Close a connection.
//    $('#close').click(function () {
//        eachActiveConnection(function (c) {
//            c.close();
//        });
//    });

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
        onMessageSend(e);
    });

});


// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};