many-slides
===========

Web presentation application for creating and sharing presentations from within your web-browser!

General
--------------------------------------
This is an ongoing student research project, which will probably be reaching a somewhat stable state around June 2014.

The main focus is to create a lightweight application which also enabled users to share their presentations with people all around the world, while minimizing the traffic needed to transfer the presentations over the internet to a bare minimum.

Each presentation is build using a single JavaScript object, which is used to render the presentation in real time, leveraging modern browser technologies and auxiliary frameworks and libraries, such as e.g. AngularJS and PeerJS.

Using this approach there is no need to establish a video stream, which would otherwise consume enormous amounts of bandwidth. Instead a peer-to-peer network consisting of the host and the viewers is established. Every peer joining the network receives a copy of the presentations JavaScript object representation from the other peers. During the presentation only the information needed to update the rendered view for all the peers are sent around, e.g. the current slide identifier.

The accompanying audio stream will (probably) be realised using WebRTC (wrapped by PeerJS or other library/framework).

Modes
--------------------------------------
There are three modes in this application:

####1. Editor Mode:

Here you are able to create your presentations.

####2. Presentation Mode:

Here you are able to send invites for your presentations as well as hold your presentations.

####3. Theater Mode:

Here you can watch and listen to presentations you have got invites to in real time.
There is also a chat available for all written communication needs.

List of external sources
--------------------------------------
AngularJS - [Home](https://angularjs.org) - [GitHub](https://github.com/angular/angular.js)  

PeerJS - [Home](https://peerjs.com) - [GitHub](https://github.com/peers/peerjs)  

UnderscoreJS - [Home](https://underscorejs.org) - [GitHub](https://github.com/jashkenas/underscore)  

angular-bootstrap-colorpicker - [GitHub](https://github.com/buberdds/angular-bootstrap-colorpicker)  


Notes
--------------------------------------
09.03.2014 - Not using ng-include directive for html templates/fragments/partials, since doing so results in unexpected behaviour
    (When including the editor-menubar fonts are not loaded before the text is hovered over or a console opened.)
    
09.03.2014 - Evaluation of Couch DB vs. Mongo DB is still to be had

09.03.2014 - We should add comparison of expected bandwidth savings of our approach vs. video stream.

09.03.2014 - Could have a look at [GoInstant](https://goinstant.com)
[GoInstant GitHub](https://github.com/goinstant/webrtc)

09.03.2014 - Definetely should have a look at these bad boys [Angular Bootstrap Directives](http://angular-ui.github.io/bootstrap/)


