// global variable that contains the name of the presneter
var name = "Presenter";

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
    // Handle a chat connection.
    if (c.label === 'chat') {

        // If a message is received
        c.on('data', function (data) {
            data = jQuery.parseJSON(data);
            onMessageRecieve(c, data);
        });

        // If connection is successfully established
        c.on('open', function (open) {

            // Message that new peer joined
            var messages = $('<div><em>' + c.metadata.name + ' joined.</em></div>');
            $('.filler').hide();
            $('#messages').append(messages);

            // Send all other peers the peerID and the name of the newly joined peer - so they can connect
            eachActiveConnection(function (con, $c) {
                if (con.label === 'chat') {
                    var message = "{\"flag\": 0, " +
                        "\"content\":\"" + c.peer + "\"," +
                        "\"name\":\"" + c.metadata.name + "\"}";
                    con.send(message);
                }
            });

            // Push new peer on the array and update the connection pane
            connectedPeers.push(c.peer);
            updateConnections();

            // Send presentation to newly connected peer
            var message = "{\"flag\": 3, \"content\":" + JSON.stringify(globalPresentation) + " }";
            console.log(message);
            c.send(message);

            // Send slide index - theater member could join later
            var message = "{\"flag\": 4, \"content\":\"" + document.getElementById('slide-index').value + "\"}";
            c.send(message);
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


// Creates an E-Mail invitation template that can be send to others
function emailInvitation() {
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
    '<div id="presentationControlls">' +
    '<span class="fui-arrow-left" ng-click="previousSlide()"></span>' +
    '<span class="fui-arrow-right" ng-click="nextSlide()"></span>' +
    '</div>' +
    '<masl-presentation></masl-presentation>' +
    '</div>';

$(function () {
    // Set w2ui layout to correct height
    var bodyHeight = $('body').height();
    // TODO - take da shit out! It is wrong!
    var navHeight =  $('#GitHubLink').height();
    if(navHeight < 53)
    {navHeight= 53;}
    $('#layout').height(bodyHeight - navHeight);

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

$(document).ready(function () {

    $('.rsh').draggable({
        axis: 'y',
        containment: 'parent',
        helper: 'clone',
        drag: (function (event, ui) {
            var height = ui.offset.top;
            $(this).prev().height(height);
        })
    });

    $("#chatWindow").resizable();

    // Button event bindings
    $('#sendDummyPresentation').click(function () {
        sendDummyPresentation();
    });

    $('#CopyPeerIdToClipboard').click(function () {
        copyPeerIdToClipboard();
    });

    $('#emailLink').click(function () {
        emailInvitation();
    });

    $('#toogleSharing').click(function () {
        toogleSharing();
    });

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
        onMessageSend(e);
    });
});