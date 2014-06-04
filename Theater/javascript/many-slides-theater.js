var name;

var peer = new Peer({host: 'it-bejga2.dhbw-stuttgart.de', port: 9000, debug: true});

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


        connectedPeers.push(c.peer);
        var message = "{\"flag\": 2 , \"send\": 1}";
        c.send(message);
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
            updateConnections();
        });
    }
}


// LAYOUT STUFF

var htmlConnections = "<p id='amount'>Connections: 0</p>" +
    "<div id='connections' >" +
    "<span class='filler'>No Audience yet.</span>" +
    "</div>";
var htmlChat = "<p id='chat'>Chat</p>" +
    "<div id='messages'>" +
    "</div>" +
    "<form id='send'>" +
    "<input type='text' id='text' placeholder='Enter message' class='form-control'>" +
    "<input type='submit' id='btnSend' value='Send' class='btn  btn-lg btn-primary'>" +
    "</form>";
var htmlPresentation = '<div id="presentationWindow">' +
    '<div id="mainWrapper">' +
    '<form id="introForm">' +
    '<h1 class="demo-section-title"> Welcome to Many Slides</h1>' +
    '<h3 class="demo-section-title">To start the show enter you name and the ID of the presentation</h3>' +
    '<input id="nameInput" class="form-control introFormTextBox" placeholder="Name" >' +
    '<br>' +
    '<input id="peerIdInput" class="form-control introFormTextBox" placeholder="ID">' +
    '<br>' +
    '<input id="startButton" type="button" class="btn btn-block btn-lg btn-primary introFormButton" value="Start">' +
    '</form>' +
    '<masl-presentation></masl-presentation>' +
    '</div>' +
    '</div>';

$(function () {
    var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
    $('#layout').w2layout({
        name: 'layout',
        panels: [
            { type: 'main', style: pstyle, content: htmlConnections},
            { type: 'preview', size: '75%', resizable: true, style: pstyle, content: htmlChat},
            { type: 'right', size: '75%', resizable: true, style: pstyle, content: htmlPresentation }
        ],
        onRefresh: function (event) {
            sidebarHeight();
        },
        onResize: function (event) {
            var myVar = setInterval(function () {
                sidebarHeight()
            }, 3);
        }
    });
});

function onStartButtonClick() {
    name = $('#nameInput').val();
    var hostId = $('#peerIdInput').val();

//    setUsername(username);
//    setHostId(hostId);
//    console.log(username);
    if (typeof hostId !== 'undefined' && hostId !== '') {
        if (name.length == 0) {
            toastr.info("No username was set. Your are now Anonymus.");
            name = 'Anonymus'
        }
        $('#introForm').hide();
        requestedPeer = hostId;
        if (!connectedPeers[requestedPeer]) {
            // Create new chat connection.
            var c = peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'none',
                reliable: false,
                metadata: {
                    name: name,
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
        toastr.info("done");
    }
    else {
        toastr.options = {"positionClass": "toast-bottom-full-width" }
        toastr.error("Please enter an ID.");
    }
}



//// Make sure things clean up properly.
//window.onunload = window.onbeforeunload = function (e) {
//    if (!!peer && !peer.destroyed) { // TODO - WTF?? Are you askigng if peer does not not exist AND peer ist not destroyed?
//        peer.destroy();
//    }
//    // Proposal:
//    // try{ peer.destroy(); } catch {}
//};

$(document).ready(function () {

    $("#chatWindow").resizable();

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
        onMessageSend(e);
    });

    $('#startButton').click(function () {
        onStartButtonClick();
    });
});
