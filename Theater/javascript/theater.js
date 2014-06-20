// Stores the name of the Audience member
var name;

// Peer Object... :)
var peer = new Peer({host: 'it-bejga2.dhbw-stuttgart.de', port: 9000, debug: true});

// Array stores all connected peers
var connectedPeers = new Array();

// Show this peer's ID.
peer.on('open', function (id) {
    $('#pid').text(id);
});

// Await connections from others
peer.on('connection', connect);

// Handle a connection object.
function connect(c) {
	'use strict';
	
    // Handle a chat connection.
    if (c.label === 'chat') {

        connectedPeers.push(c.peer);
		var message = {'flag': 2 , 'send': 1}; 
        c.send(JSON.stringify(message));
		
        $('#audience-placeholder').hide();
        $('#messages').append(messages);

		// If a message is received
        c.on('data', function (data) {
            data = JSON.parse(data);
            onMessageRecieve(c, data);
        });

        // If a Peer leaves, a message is shown and he gets removed from the list
        c.on('close', function () {
            $('#messages').append(
				'<div>' +
					'<em>' + c.metadata.name + ' has left the Chat.</em>' +
				'</div>'
			);

            if (peer.connections === 'undefined') {
                $('.filler').show();
            }
            delete connectedPeers[c.peer];
            updateConnections();
        });
    }
}

// LAYOUT STUFF
var htmlPresentation =	'<div id="presentationWindow">' +
							'<div id="mainWrapper">' +
								'<p id="testID" style="display: none">Presenter is not sharing at the moment.</p>' +
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

function onStartButtonClick() {
	'use strict';
	
    var hostId = $('#peerIdInput').val();

    if (typeof hostId !== 'undefined' && hostId !== '') {
		name = $('#nameInput').val() || 'Anonymus';
		
        if (name === 'Anonymus') {
            toastr.info('No username was set. Your are now Anonymus.');
        }
		
        $('#introForm').hide();
		
        if (!connectedPeers[hostId]) {
            // Create new chat connection.
            var c = peer.connect(hostId, {
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
                console.error(err);
            });
        }
		
        connectedPeers[hostId] = 1;
		
    } else {
        toastr.options = { 'positionClass': 'toast-bottom-full-width' };
        toastr.error('Please enter an ID.');
    }
}

$(document).ready(function () {
	'use strict';
	
	commonBindings();
	
    $('#startButton').click(function () {
        onStartButtonClick();
    });
});
