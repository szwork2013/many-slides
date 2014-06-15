app.directive('maslLogo', function () {
    'use strict';
    
    return {
        restrict: 'E',
        require: ['^logoColor', '^logoSize'],
        scope: {
            logoColor: '@',
            logoSize: '@'
        },
        replace: true,
        template:   '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
						'style="width: {{logoSize}}; height: {{logoSize}};" viewBox="-2 -5 105 100">' +
                        '<defs></defs>' +
                        '<g>' +
                            '<path d="M20.329,22.686c-0.734-2.246,0.492-4.662,2.737-5.397l16.881-5.521l-3.233-4.282c-1.423-1.885-4.105-2.261-5.991-0.836   L1.7,28.562c-1.885,1.424-2.259,4.107-0.835,5.993L36.31,81.501c1.424,1.885,2.064,3.039,3.951,1.612c0,0-0.967-2.449-1.643-4.52   L20.329,22.686z" transform="translate(0.5590000152587891,-5.225001335144043)" fill="{{logoColor}}"></path>' +
                            '<path d="M70.474,17.096l-1.799-5.5c-0.734-2.246-3.148-3.472-5.397-2.737L28.716,20.165c-2.245,0.735-3.47,3.15-2.737,5.396   l18.29,55.91c0.733,2.246,1.599,3.139,3.277,2.684c0,0,0.19-2.729,0.292-4.92l2.679-58.766c0.108-2.361,2.109-4.187,4.466-4.079   L70.474,17.096z" transform="translate(0.5590000152587891,-5.225001335144043)" fill="{{logoColor}}"></path>' +
                            '<path d="M95.917,23.335l-36.33-1.657c-2.356-0.107-4.357,1.718-4.465,4.08l-2.683,58.764c-0.108,2.359,1.72,4.359,4.078,4.467   l36.33,1.658c2.358,0.106,4.358-1.721,4.468-4.078l2.68-58.766C100.103,25.443,98.276,23.442,95.917,23.335z M82.318,57.349   l-0.205,13.374l-6.634-11.944L64.861,62.76l6.942-10.719L58.43,46.528l13.675-0.911l-1.424-15.475l8.37,12.914l9.7-4.798   l-6.839,11.332l11.892,7.81L82.318,57.349z" transform="translate(0.5590000152587891,-5.225001335144043)" fill="{{logoColor}}"></path>' +
                        '</g>' +
                    '</svg>'
    };
});

app.directive('maslFooter', function () {
    'use strict';
    
	function link(scope, element, attrs) {
		$('.footer-toggle').on('click', function(){
			$(this).toggleClass('active');
		});
	}
	
    return {
        restrict: 'E',
        scope: true,
        replace: true,
		link: link,
        template:   '<span class="footer-toggle">●</span>'
    };
});