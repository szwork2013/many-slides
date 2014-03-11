function onMessageRecieve(c, data) {

    console.log("Logging Peer");
    console.log(peer);

    // Recive new peer ID
    if (data.flag == 0) {
        console.log(data);
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
                var message = "{\"flag\": 3, \"peer\":\"" + peer.id + "\", \"name\":\"" + name + "\"}";
                c.send(message);
            });
            c.on('error', function (err) {
                alert(err);
            });

        }
        connectedPeers[requestedPeer] = 1;
        console.log("Message recieved - printing c");
        console.log(c);
        $('#messages').append('<div><em>' + c.metadata.name + " - " + c.peer + ' joined.</em></div>');

    }
    // Recieve normal text message
    else if (data.flag == 1) {
        $('#messages').append('<div><span class="peer">' + c.metadata.name + " - " + c.peer + '</span>: ' + data.content + '</div>');
    }

    // NOT USED
    else if (data.flag == 2) {
        var message = "{\"flag\": 3, \"peer\":\"" + peer.id + "\", \"name\":\"" + name + "\"}";
        c.send(message);
    }
    else if (data.flag == 3) {
        console.log(peer.connections[data.peer][0].peer + " - " + data.peer);
        peer.connections[data.peer][0].metadata.name = data.name;
        console.log(peer.connections[data.peer][0].metadata.name + " - " + data.name);
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