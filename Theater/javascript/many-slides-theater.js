
var name;
var peer = new Peer ({host: 'it-bejga2.dhbw-stuttgart.de', port:9000, debug:true});
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
        console.log(peer);
//        var messages = $('<div><em>Peer ' + c.peer + ' connected.</em></div>').addClass('messages');

        connectedPeers.push(c.peer);
        var message = "{\"flag\": 2 , \"send\": 1}";
        c.send (message);
        $('.filler').hide();
        $('#messages').append(messages);

        c.on('data', function (data) {
            data = jQuery.parseJSON(data);
            onMessageRecieve(c, data);
        });
        // If a Peer leave a message gets shown and he gets removed from the list
        c.on('close', function () {
            $('#messages').append('<div><em>' + c.metadata.name + ' has left the Chat.</em></div>');

            if (peer.connections == 'undefined') {
                $('.filler').show();
            }
            delete connectedPeers[c.peer];
        });
    }
}

$(document).ready(function () {
    name = getUrlVars()["name"];

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
                metadata: {
                    name: getUrlVars()["name"],
                    message: 'hi i want to chat with you!'
                }
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