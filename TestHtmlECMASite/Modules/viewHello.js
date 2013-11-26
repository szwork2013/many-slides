exports.show = function (nano1) {

    //alert('viewHello Show');

    // Create a div for the html elements in this module
    var nano2div = new nano({ parent: nano1, tag: 'div' });

    // Create a new nano DOM node that is a child of the parameter passed in and add a span
    var nano2 = new nano({ parent: nano2div, tag: 'span', text: 'View' });
    nano2.attr({ id: 'testnode2' });
    nano2.addClass('testview');

    // Create a div within the page that contains a button
    var buttondiv = new nano({ parent: nano1, tag: 'div' });

    var btnAlert = new nano({
        parent: buttondiv,
        tag: 'button',
        text: 'Show Message',
        evt: {
            click: function () {
                alert('Button says: ' + nano(this).get());
            }
        }
    });


}