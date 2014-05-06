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
//                $('#messages').append('<div><span class="you">You: </span>' + c.peer + ' Joined</div>');
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

$(document).ready(function () {

    function doNothing(e) {
        e.preventDefault();
        e.stopPropagation();
    }

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

function toggleSharing() {
    var toggleSharing =  document.getElementById("toogleSharing");
    if (toggleSharing.attributes.class.value == "switch-on") {
        toggleSharing.attributes.class.value = "switch-off"
        toggleSharing.innerHTML = "Start Sharing";
    }
    else if (toggleSharing.attributes.class.value == "switch-off") {
        toggleSharing.attributes.class.value = "switch-on"
        toggleSharing.innerHTML = "Stop Sharing";
    }
}


function shareLink() {
    var peerID = document.getElementById("pid").innerHTML;
    window.open("index.html?&peerID=" + peerID);
}
function emailLink(){
    var peerID = document.getElementById("pid").innerHTML;
    alert(peerID);
    var subject = "Many Slide Presentation";
    var body = "Hi there, I would like to share this Many Slide Presentation with you. Just follow the link below  index.html?&peerID=" + peerID + " .";
    window.location.href = 'mailto:?subject='+subject + '&body=' + body;
}

$('.rsh').draggable({
    axis: 'y',
    containment: 'parent',
    helper: 'clone',
    drag: function (event, ui) {
        var height = ui.offset.top;
        $(this).prev().height(height);
    }
});
$(function() {
    $( "#chatWindow" ).resizable();
});

