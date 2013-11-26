
//alert('Container 2 Opened');
// Create a new nano DOM node from the body of the html and tag it as a div
var nano1 = new nano({ parent: nano.body(), tag: 'div' });
nano1.addClass('test');
nano1.attr({ id: 'testnode1' });

// Inject the menu js
require('menuMain').show(nano1);

// Inject the view js
require('viewHello').show(nano1);