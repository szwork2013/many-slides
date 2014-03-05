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
    alert(c);
    console.log(c);
    // Handle a chat connection.
    if (c.label === 'chat') {
        var messages = $('<div><em>Peer ' + c.peer +' joined.</em></div>').addClass('messages');

        eachActiveConnection(function (con, $c) {
            if (con.label === 'chat') {
                var message = "{\"flag\": 0, \"content\":\""+ c.peer + "\"}";
                con.send(message);
//                $('#messages').append('<div><span class="you">You: </span>' + c.peer + ' Joined</div>');
            }
        });

        connectedPeers.push(c.peer);
        console.log(c.peer);
        // Select connection handler.
        $('.filler').hide();
        $('#messages').append(messages);



        c.on('data', function (data) {
            console.log(data);
            data = jQuery.parseJSON(data);
            onMessageRecieve(c,data);

//            eachActiveConnection(function (c, $c) {
//                if (c.label === 'chat') {
//                    c.send(data);
//                }
//            });
        });
    }
}

$(document).ready(function () {

    function doNothing(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    //---- is probably not used
    // Close a connection.
//    $('#close').click(function () {
//        eachActiveConnection(function (c) {
//            c.close();
//        });
//    });

    // Send a chat message to all active connections.
//    $('#send').submit(function (e) {
//        alert("HI");
//        onMessageSend(e);
//    });

});



// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};