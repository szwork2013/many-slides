exports.show = function(nano1) {
    
    // Create a div for the html elements in this module
    var nano3div = new nano({ parent: nano1, tag: 'div'});

    // Create a new nano DOM node that is a child of the div node and add some content
    var nano3 = new nano({ parent: nano3div, tag: 'span', text: 'Menu' });
    nano3.attr({ id: 'testnode3' });
    nano3.addClass('testmenu');
};