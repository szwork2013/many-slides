var MediaManager = (function () {
    'use strict';

    function bindThemAll() {
        $('#item-controls-button').click(function () {
            $(".sidebar-right").toggleClass('sidebar-gone');
        });

        $('#item-controls-button').mouseenter(function () {
            $(".sidebar-right").removeClass('sidebar-gone');
        });

        $('#item-controls-button').mouseleave(function () {
            $(".sidebar-right").addClass('sidebar-gone');
        });

        $('#slide-controls-button').click(function () {
            $(".sidebar-left").toggleClass('sidebar-gone');
        });

        $('#slide-controls-button').mouseenter(function () {
            $(".sidebar-left").removeClass('sidebar-gone');
        });

        $('#slide-controls-button').mouseleave(function () {
            $(".sidebar-left").addClass('sidebar-gone');
        });

/*        $('.sidebar-right').click(function () {
            $(".sidebar-right").toggleClass('sidebar-gone');
        });*/

/*        $('.sidebar-right').mouseleave(function () {
            $(".sidebar-right").addClass('sidebar-gone');
        });*/

        $('.sidebar-right').mouseenter(function () {
            $(".sidebar-right").removeClass('sidebar-gone');
        });

 /*       $('.sidebar-left').click(function () {
            $(".sidebar-left").toggleClass('sidebar-gone');
        });*/

        $('.sidebar-left').mouseleave(function () {
            $(".sidebar-left").addClass('sidebar-gone');
        });

        $('.sidebar-left').mouseenter(function () {
            $(".sidebar-left").removeClass('sidebar-gone');
        });
    }

    return {
        init: function () {
            bindThemAll();
        }
    };
}());

MediaManager.init();
window.setInterval("MediaManager.init()", 1000); // Tmp workaround to bind event when angular is done
                                                 // Interferes with events responsivenes