// Connect to PeerJS, have server assign an ID instead of providing one
// Showing off some of the configs available with PeerJS :).

function shareLink()
{
    var peerID = document.getElementById("pid").innerHTML;
    console.log("Sharing Link with ID " + peerID);
    window.open("index.html?&peerID=" + peerID);
}


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
        var messages = $('<div><em>Peer ' + c.peer +' connected.</em></div>').addClass('messages');

        connectedPeers.push(c.peer);
        console.log(c.peer);
        // Select connection handler.
        $('.filler').hide();
        $('#messages').append(messages);



        c.on('data', function (data) {
            eachActiveConnection(function (c, $c) {
                if (c.label === 'chat') {
                    c.send(data);
                }
            });
            $('#messages').append('<div><span class="peer">' + c.peer + '</span>: ' + data +
                '</div>');
            console.log(data);
        });
        c.on('close', function () {
            alert(c.peer + ' has left the chat.');
// ----------------------            DO BE DONE
//            chatbox.remove();
// ----------------------            DO BE DONE
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
            // Create 2 connections, one labelled chat and another labelled file.
            var c = peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'none',
                reliable: false,
                metadata: { message: 'hi i want to chat with you!' }
            });
            c.on('open', function () {
                connect(c);
            });
            c.on('error', function (err) { alert(err); });
            var f = peer.connect(requestedPeer, { label: 'file' });
            f.on('open', function () {
                connect(f);
            });
            f.on('error', function (err) { alert(err); });
        }
        connectedPeers[requestedPeer] = 1;
    });

    // Close a connection.
    $('#close').click(function () {
        eachActiveConnection(function (c) {
            c.close();
        });
    });

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
        e.preventDefault();
        // For each active connection, send the message.
        var msg = $('#text').val();
        eachActiveConnection(function (c, $c) {
            if (c.label === 'chat') {
                c.send(msg);
                $('#messages').append('<div><span class="you">You: </span>' + msg + '</div>');
            }
        });
        $('#text').val('');
        $('#text').focus();
    });

//    // Show browser version
//    $('#browsers').text(navigator.userAgent);
});


// Goes through each active peer and calls FN on its connections.
function eachActiveConnection(fn) {
    var checkedIds = {};

    connectedPeers.forEach(function(entry) {
        console.log(entry);
//
//        actives.each(function () {
//            var peerId = $(this).attr('id');
        var peerId = (entry);

        if (!checkedIds[peerId]) {
            var conns = peer.connections[peerId];
            for (var i = 0, ii = conns.length; i < ii; i += 1) {
                var conn = conns[i];
                fn(conn, $('#messages'));
            }
        }

        checkedIds[peerId] = 1;
    });
}


// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};