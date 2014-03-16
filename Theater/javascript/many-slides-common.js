function sendDummyPresentation() {
    // For each active connection, send the message.
    eachActiveConnection(function (c, $c) {
        if (c.label === 'chat') {
            var message = "{\"flag\": 3, \"content\":\"" + "'<b>this is bold content</b>'" + "\"}";
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

    // Recive new peer ID
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
        $('#messages').append('<div><em>' + c.metadata.name + " - " + c.peer + ' joined.</em></div>');
    }

    // Recieve normal text message
    else if (data.flag == 1) {
        $('#messages').append('<div><span class="peer">' + c.metadata.name + " - " + c.peer + '</span><em>: ' + data.content + '</em></div>');
    }

    // Send name or request names of other peer
    else if (data.flag == 2) {
        if (data.send == 1) {
            var message = "{\"flag\": 2, \"send\": 0  ,\"peer\":\"" + peer.id + "\", \"name\":\"" + name + "\"}";
            c.send(message);
        }
        else if (data.send == 0) {
            // Looking for the corresponding peerID in the Array, after that the correct name gets set
            console.log(peer.connections[data.peer][0].peer + " - " + data.peer);
            peer.connections[data.peer][0].metadata.name = data.name;
            console.log(peer.connections[data.peer][0].metadata.name + " - " + data.name);

            updateConnections();
        }
    }

    else if (data.flag == 3) {
        console.log("received data");
        console.log(data);
        $scope.presentation = data.content;
    }
}

function onMessageSend(e) {
    e.preventDefault();
    // For each active connection, send the message.
    var msg = $('#text').val();
    eachActiveConnection(function (c, $c) {
        if (c.label === 'chat') {
            var message = "{\"flag\": 1, \"content\":\"" + msg + "\"}";
            console.log(message);
            c.send(message);
        }
    });
    $('#messages').append('<div><span class="you">You: </span>' + msg + '</div>');
    $('#text').val('');
    $('#text').focus();
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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
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