app.controller('modalCtrl', function ($scope, $modal, $log) {
	var sources = {};
	
	init();
	
	function init() {
		console.log('start request');
		var xhr=new XMLHttpRequest();
		xhr.responseType='json';
		xhr.open('GET', 'factories/sources.json');
		xhr.onload=function() {
			sources = this.response;
		}
		xhr.send();
	}
	
	$scope.open = function (size) {
        var manifest = chrome.runtime.getManifest();
        var modalInstance = $modal.open({
            template:   '<div class="modal-header">' +
                            '<h4 class="modal-title">About Many-Slides</h4>' +
							'<masl-logo logo-color="#1ABC9C" logo-size="53px"></masl-logo>' +
                        '</div>' +
                        '<div class="modal-body">' +
							'<p>If you need help using Many-Slides or have further questions there are several ways you can reach out:</p>' +
							'<p><ul>' +
								'<li>' +
									'<a href="' + sources.webstore_url + '" target="_blank">Web Store Page</a> ' +
									'&mdash; Here you will find general information and changelogs.' +
								'</li>' +
								'<li>' +
									'<a href="' + sources.google_plus_url + '" target="_blank">Google Plus Page</a> ' +
									'&mdash; A place for discussions and announcements.' +
								'</li>' +
								'<li>' +
									'<a href="' + sources.wiki_url + '" target="_blank">The Wiki</a> ' +
									'&mdash; Here you will find detailed information and frequently asked questions.' +
								'</li>' +
								'<li>' +
									'<a href="' + sources.support_url + '" target="_blank">Issue Tracker</a> ' +
									'&mdash; Here you can report bugs or share ' +
									'ideas you think would make many slides even better!' +
								'</li>' +
							'</ul></p>' +
							'<b>Attributions</b>' +
                            '<div>Many-Slides is made possible by the open source community on ' +
                                '<a href="' + sources.github_url + '" target="_blank">GitHub</a>.</div>' +
							'<div>Our Logo is a derivative work of "Flash Cards" by ' +
                                '<a href="' + sources.logo_author_url + '" target="_blank">Brennan Novak</a>' +
                                ' from ' +
                                '<a href="' + sources.nounproject_url + '" target="_blank">The Noun Project</a>.</div>' +
                        '</div>' +
                        '<div class="modal-footer">' +
							'<span class="version">Version ' + manifest.version + '</span>' +
                            '<button class="btn btn-primary" ng-click="ok()">Got it!</button>' +
                        '</div>',
            size: size,
            controller: function ($scope, $modalInstance) {
							$scope.ok = function () { $modalInstance.close(); };
							$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
						}
        });
    };
});