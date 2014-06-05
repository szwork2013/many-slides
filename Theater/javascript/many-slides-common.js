var globalPresentation;

function sendDummyPresentation() {
    console.log(globalPresentation);
    // For each active connection, send the message.
    eachActiveConnection(function (c, $c) {
        if (c.label === 'chat') {
            var message = "{\"flag\": 3, \"content\":" + JSON.stringify(globalPresentation) + " }";
            console.log(message);
            c.send(message);
        }
    });
    $('#messages').append('<div><span class="you">You: </span> dummy send </div>');
    $('#text').val('');
    $('#text').focus();
}

// Function that is run when a message is received.
// Distinguished between different cases of messages
function onMessageRecieve(c, data) {

    // Receive new peer ID
    if (data.flag == 0) {
        connectedPeers.push(data.content);
        requestedPeer = data.content;
        if (!connectedPeers[requestedPeer]) {
            // Create new chat connection.
            var c = peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'none',
                reliable: false,
                metadata: {
                    name: data.name,
                    message: 'nothing to do here!'
                }
            });
            c.on('open', function () {
                connect(c);
                var message = "{\"flag\": 2, \"send\": 0  ,\"peer\":\"" + peer.id + "\", \"name\":\"" + name + "\"}";
                c.send(message);
            });
            c.on('error', function (err) {
                alert(err);
            });

        }
        connectedPeers[requestedPeer] = 1;
        $('#messages').append('<div><em>' + c.metadata.name + ' joined.</em></div>');
    }

    // Receive normal text message
    else if (data.flag == 1) {
        $('#messages').append('<div><span class="peer">' + c.metadata.name + '</span><em>: ' + data.content + '</em></div>');
    }

    // Send name or request names of other peer
    else if (data.flag == 2) {
        if (data.send == 1) {
            var message = "{\"flag\": 2, \"send\": 0  ,\"peer\":\"" + peer.id + "\", \"name\":\"" + name + "\"}";
            c.send(message);
        }
        else if (data.send == 0) {
            // Looking for the corresponding peerID in the Array, after that, the correct name gets set
            peer.connections[data.peer][0].metadata.name = data.name;

            updateConnections();
        }
    }

    // If presentation JSON is received
    else if (data.flag == 3) {
        $('#presentation-content').val(JSON.stringify(data.content)).change();
        $('#slide-index').val(0).change();
        // TODO - remove
        $('#messages').append('<div><em>' + c.metadata.name + " - data received</em></div>");
    }

    else if (data.flag == 4) {
        // New presentation index received
        $('#slide-index').val(data.content).change();
        // TODO - remove
        $('#messages').append('<div><em>' + c.metadata.name + " - data received</em></div>");
    }
}


function onMessageSend(flag) {

    // Does not allow the sending of an empty string
    if (!jQuery.isEmptyObject(peer.connections)) {
        // For each active connection, send the message.
        var msg = $('#text').val();
        eachActiveConnection(function (c, $c) {
            if (c.label === 'chat') {

                // Send normal message
                if (flag == 1) {
                    var message = "{\"flag\": 1, \"content\":\"" + msg + "\"}";
                    $('#messages').append('<div><span class="you">You: </span>' + msg + '</div>');
                    $('#text').val('');
                    $('#text').focus();
                }

                // Send slide index
                else if (flag == 4) {
                    var message = "{\"flag\": 4, \"content\":\"" + document.getElementById('slide-index').value + "\"}";
                }
                c.send(message);
            }
        });
    }
    else {
        toastr.info("Unable to send message, no members in chat yet.");
    }
}
// Goes through each active peer and calls FN on its connections.
function eachActiveConnection(fn) {
    var checkedIds = {};

    connectedPeers.forEach(function (entry) {
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


// Updates the list of all connections. Removes them and them adds them all sorted new
function updateConnections() {
    $('#connections').empty();

    var names = new Array();
    connectedPeers.forEach(function (entry) {
        var peerId = (entry);
        names.push(peer.connections[peerId][0].metadata.name);
    });
    names.push(name);
    names.sort();
    names.forEach(function (name) {
        $('#connections').append("<div><img class='dot' src='images/dot.png'>" + name + "</div>");
    });

    $('#amount').empty();
    $('#amount').append("Connections: " + names.length);
}


function sidebarHeight() {
    var wrapperChatWindow = $("#layout_layout_panel_preview").height();
    var sendAreaHeight = $("#send").height();
    var chatTextAreaHeight = $("#chat").height();
    $("#messages").height(wrapperChatWindow - sendAreaHeight - chatTextAreaHeight - 90);

    var wrapperConnectionsWindow = $("#layout_layout_panel_main").height();
    var amountTextAreaHeight = $("#amount").height();
    $("#connections").height(wrapperConnectionsWindow - amountTextAreaHeight - 10);
}


// Copy PeerID to Clipboard - uses general copyToClipboard function
function copyPeerIdToClipboard() {
    var peerID = document.getElementById("pid").innerHTML;
    copyToClipboard(peerID);
}

// General function to copy a parameter object to the clipboard
function copyToClipboard(text) {
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.getElementById("wrapper").appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.getElementById("wrapper").removeChild(copyDiv);
}