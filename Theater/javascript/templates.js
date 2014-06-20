var templates = (function () {
	'use strict';
	return {
		connections: 	"<p id='amount'>Connections: 0</p>" +
						"<div id='active-connections'>" +
							"<span id='audience-placeholder'>No Audience yet.</span>" +
						"</div>",
		
		chat: 			"<p id='chat'>Chat</p>" +
						"<div id='messages'></div>" +
						"<form id='send'>" +
							"<input type='text' id='text' placeholder='Enter message' class='form-control'>" +
							"<input type='submit' id='btnSend' value='Send' class='btn  btn-lg btn-primary'>" +
						"</form>",
		
		ownMessage: function (content) {
						return 	'<div>' +
									'<span class="you">You: </span>' + content +
								'</div>';
					},
		
		peerMessage: function (name, content) {
						return 	'<div>' +
									'<span class="peer">' + name + '</span>' +
									'<em>: ' + content + '</em>' +
								'</div>'
		}
	};
}());