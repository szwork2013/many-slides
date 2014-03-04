function onMessageRecieve()
{


}

function onMessageSend(e)
{
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
}
// Goes through each active peer and calls FN on its connections.
function eachActiveConnection(fn) {
    var checkedIds = {};

    connectedPeers.forEach(function(entry) {
        console.log(entry);
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