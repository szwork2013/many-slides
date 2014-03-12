

var name = "Presenter";
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
        var messages = $('<div><em>' + c.metadata.name +" - " +c.peer + ' joined.</em></div>');

        eachActiveConnection(function (con, $c) {
            if (con.label === 'chat') {
                var message = "{\"flag\": 0, " +
                    "\"content\":\""+ c.peer + "\"," +
                    "\"name\":\""+ c.metadata.name+"\"}";
                con.send(message);
//                $('#messages').append('<div><span class="you">You: </span>' + c.peer + ' Joined</div>');
            }
        });

        connectedPeers.push(c.peer);
        // Select connection handler.
        $('.filler').hide();
        $('#messages').append(messages);


        // If a message is received
        c.on('data', function (data) {
            data = jQuery.parseJSON(data);
            onMessageRecieve(c,data);
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

    function doNothing(e) {
        e.preventDefault();
        e.stopPropagation();
    }
});

// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};

function shareLink()
{
    var peerID = document.getElementById("pid").innerHTML;
    window.open("index.html?&peerID=" + peerID);
}