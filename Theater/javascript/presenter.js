// global variable that contains the name of the presenter
var name = 'Presenter';

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

        // If a message is received
        c.on('data', function (data) {
            data = JSON.parse(data);
            onMessageRecieve(c, data);
        });

        // If connection is successfully established
        c.on('open', function (open) {

            // Message that new peer joined
            $('.filler').hide();
			var message = {};
            var messages = $('<div><em>' + c.metadata.name + ' joined.</em></div>');
            $('#messages').append(messages);

            // Send all other peers the peerID and the name of the newly joined peer - so they can connect
            foreachActiveConnection(function (con, $c) {
                if (con.label === 'chat') {
                    message = {
						'flag': 0,
                        'content': c.peer,
                        'name': c.metadata.name
					};
                    con.send(JSON.stringify(message));
                }
            });

            // Push new peer on the array and update the connection pane
            connectedPeers.push(c.peer);
            updateConnections();

            // Send presentation to newly connected peer
			message = {
				'flag': 3,
				'content': globalPresentation
			};
            c.send(JSON.stringify(message));

            // Send slide index - theater member could join later
			message = {
				'flag': 4,
				'content': document.getElementById('slide-index').value
			};
            // TODO Send all initial content
            c.send(JSON.stringify(message));
        });

        // If a Peer leaves, a message gets shown and he gets removed from the list
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


// Creates an E-Mail invitation template that can be send to others
function emailInvitation() {
	'use strict';
	
    var peerID = document.getElementById("pid").innerHTML;
    var subject = encodeURIComponent("Join my Many Slide Presentation");
    var body = "Hi,\n\n " +
        "please join my many slides presentation!\n"
        + "This is my peerID: " + encodeURIComponent(peerID) + "\n\n "
        + "Regards \n\n\n"
        + "https://chrome.google.com/webstore/detail/many-slides/nipeaiehjdhhgfioacjemeepecmegdap";
    body = encodeURIComponent(body);
    var mailToStr = "mailto:?Subject=" + subject + "&Body=" + body;
    console.log(mailToStr);
    tmpMailWindow = window.open(mailToStr);
	// TODO - tmpMailWindow says: "Please find a way to close me!"
}

// LAYOUT STUFF
var htmlPresentation =	'<div id="presentationWindow">' +
							'<div class="btn-toolbar" id="presentationControlls">' +
								'<div class="btn-group">' +
									'<a class="btn btn-primary fui-arrow-left" ng-click="previousSlide()"></a>' +
									'<a id="blankPresentation" class="btn btn-primary" ng-click="blankPresentation()">hide</a>' +
									//    '<div class="switch has-switch">'+
									//        '<div class="switch-off switch-animate">' +
									//            '<input data-toggle="switch" type="checkbox">' +
									//            ' <span class="switch-left">ON</span>' +
									//            '  <label>&nbsp;</label>' +
									//            '   <span class="switch-right">OFF</span>' +
									//            '</div>' +
									//        '</div>' +
									//    '</div>' +
									'<a class="btn btn-primary fui-arrow-right" ng-click="nextSlide()"></a>' +
								'</div>' +
							'</div>' +
							'<masl-presentation></masl-presentation>' +
						'</div>';

$(document).ready(function () {
	'use strict';
	
	commonBindings();
	
    $('.rsh').draggable({
        axis: 'y',
        containment: 'parent',
        helper: 'clone',
        drag: function (event, ui) {
            var height = ui.offset.top;
            $(this).prev().height(height);
        }
    });

    $('#CopyPeerIdToClipboard').click(function () {
        copyPeerIdToClipboard();
    });

    $('#emailLink').click(function () {
        emailInvitation();
    });
	
	//$('#toogleSharing').click(function () {
		//toogleSharing();
	//});
});