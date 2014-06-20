var globalPresentation;

function sendPresentationToAll() {
    // For each active connection, send the message.
    foreachActiveConnection(function (c, $c) {
        if (c.label === 'chat') {
            var message = {
				'flag': 3,
				'conten': JSON.stringify(globalPresentation)
			};
            c.send(JSON.stringify(message));
        }
    });
    $('#text').focus();
}

// Distinguished between different cases of messages
function onMessageRecieve(c, data) {

    // Receive new peer ID
    if (data.flag == 0) {
        connectedPeers.push(data.content);
        var requestedPeer = data.content;
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
				var message = {
					'flag': 2,
					'send': 0,
					'peer': peer.id,
					'name': name
				};
                c.send(JSON.stringify(message));
            });
			
            c.on('error', function (err) {
                console.error(err);
            });

        }
		
        connectedPeers[requestedPeer] = 1;
		
        $('#messages').append(
			'<div>' +
				'<em>' + c.metadata.name + ' joined.</em>' +
			'</div>'
		);
    }

    // Receive normal text message
    else if (data.flag == 1) {
        $('#messages').append(
			templates.peerMessage(c.metadata.name, data.content)
		);
    }

    // Send name or request names of other peer
    else if (data.flag == 2) {
		
        if (data.send == 1) {
			var message = {
				'flag': data.flag,
				'send': 0,
				'peer': peer.id,
				'name': name
			}
            c.send(JSON.stringify(message));
        }
		
        else if (data.send == 0) {
            // Look for the peerID in the Array,
			// then the correct name gets set
            peer.connections[data.peer][0].metadata.name = data.name;
            updateConnections();
        }
    }

    // If presentation JSON is received
    else if (data.flag == 3) {
        $('#slide-index').val(0).change();
        $('#presentation-content').val(
			JSON.stringify(data.content)
		).change();
    }

    else if (data.flag == 4) {
		// command == 1 : New slide index
		// command == 2 : Hide presentation
		// command == 3 : Show presentation

        if (data.command == 1) {
            $('#slide-index').val(data.content).change();
        }
		
        else if (data.command == 2) {
            $('#presentation').hide();
            $('#testID').show();
        }

        else if (data.command == 3) {
            $('#presentation').show();
            $('#testID').hide();
        }
    }
}

function onMessageSend(flag, command) {

    // Does not allow the sending to nobody
    if (!jQuery.isEmptyObject(peer.connections)) {
        // Send the message to each active connection
        foreachActiveConnection(function (c, $c) {
            if (c.label === 'chat') {
				var message = {};
				message.flag = flag;
				
                // Send normal message (if not empty)
                if (flag == 1) {
					message.content = $('#text').val();
					
					if (message.content && !message.content.isEmpty()) {
						$('#text').val('').focus();
						$('#messages').append(
							templates.ownMessage(message.content)
						);

						c.send(JSON.stringify(message));
					}
				}

                else if (flag == 4) {
					message.command = command;
					
                    // command == 1 : Send slide index
                    // command == 2 : Hide presentation
                    // command == 3 : Show presentation
                	
                    if (command == 1) {
                        message.content = $('#slide-index').val();
                    }
					
                	c.send(JSON.stringify(message));
                }
            }
        });
    }
    else {
        toastr.info('Unable to send message, no members in chat yet.');
    }
}
// Goes through each active peer and calls FN on its connections.
function foreachActiveConnection(fn) {
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

// Updates the list of all connections.
// Removes them and them adds them all sorted new
function updateConnections() {
    $('#active-connections').empty();

    var names = new Array();
    connectedPeers.forEach(function (entry) {
        var peerId = (entry);
        names.push(peer.connections[peerId][0].metadata.name);
    });
    names.push(name);
    names.sort();
    names.forEach(function (name) {
        $('#active-connections').append(
			'<div>' +
				'<img class="dot" src="../images/dot.png">' +
				name +
			'</div>'
		);
    });

    $('#amount').empty();
    $('#amount').append('Connections: ' + names.length);
}

function sidebarHeight() {
    var wrapperChatWindow = $('#layout_layout_panel_preview').height();
    var sendAreaHeight = $('#send').height();
    var chatTextAreaHeight = $('#chat').height();
    $('#messages').height(
		wrapperChatWindow - sendAreaHeight - chatTextAreaHeight - 90
	);

    var wrapperConnectionsWindow = $('#layout_layout_panel_main').height();
    var amountTextAreaHeight = $('#amount').height();
    $('#active-connections').height(
		wrapperConnectionsWindow - amountTextAreaHeight - 10
	);
}

// Copy PeerID to Clipboard - uses general copyToClipboard function
function copyPeerIdToClipboard() {
    var peerID = document.getElementById('pid').innerHTML;
    copyToClipboard(peerID);
}

// General function to copy a parameter object to the clipboard
function copyToClipboard(text) {
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.getElementById('wrapper').appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = 'off';
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand('Copy', false, null);
    document.getElementById('wrapper').removeChild(copyDiv);
}

window.onresize = function () {
    var myVar = setInterval(function () {
        setLayoutSize()
    }, 3);
};

function setLayoutSize() {
    var bodyHeight = $('body').height();
    // TODO - take da shit out! It is wrong!
    var navHeight = $('#GitHubLink').height();
    if (navHeight < 53) {
        navHeight = 53;
    }

    $('#layout').height(bodyHeight - navHeight);
}

$(function () {
    setLayoutSize();

    var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
    $('#layout').w2layout({
        name: 'layout',
        panels: [
            { 
				type: 'main',
				style: pstyle, content: templates.connections
			},
            { 
				type: 'preview', size: '75%', resizable: true,
				style: pstyle, content: templates.chat
			},
            { 
				type: 'right', size: '75%', resizable: true,
				style: pstyle, content: htmlPresentation 
			}
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

function commonBindings() {
	'use strict';
	
    $('#chatWindow').resizable();

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
		e.preventDefault();
        onMessageSend(1);
    });
};

// Utility stuff

//For checking if a string is empty, null or undefined I use:
function isEmpty(str) {
    return (!str || 0 === str.length);
}

//For checking if a string is blank, null or undefined I use:
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

//For checking if a string is blank or contains only white-space:
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};