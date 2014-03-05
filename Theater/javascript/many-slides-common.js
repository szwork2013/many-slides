function onMessageRecieve(c, data) {

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


        $('#messages').append('<div><em>Peer ' + c.peer +' joined.</em></div>');
    }
    // Recieve normal text message
    if (data.flag == 1) {
        console.log(c);
        $('#messages').append('<div><span class="peer">' + c.peer + '</span>: ' + data.content + '</div>');
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
        console.log(entry);
        var peerId = (entry);

        if (!checkedIds[peerId]) {
            console.log(peer);
            var conns = peer.connections[peerId];
            for (var i = 0, ii = conns.length; i < ii; i += 1) {
                var conn = conns[i];
                fn(conn, $('#messages'));
            }
        }

        checkedIds[peerId] = 1;
    });
}