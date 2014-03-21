var MediaManager = (function () {
    'use strict';

    function bindThemAll() {
        $('#settings-button').click(function () {
            $("#sidebar-right").toggleClass('hidden');
        });

        $('#settings-button').mouseenter(function () {
            $("#sidebar-right").removeClass('hidden');
        });

        $('#settings-button').mouseleave(function () {
            $("#sidebar-right").addClass('hidden');
        });

        $('#actions-button').click(function () {
            $("#sidebar-left").toggleClass('hidden');
        });

        $('#actions-button').mouseenter(function () {
            $("#sidebar-left").removeClass('hidden');
        });

        $('#actions-button').mouseleave(function () {
            $("#sidebar-left").addClass('hidden');
        });

        $('#sidebar-right').click(function () {
            $("#sidebar-right").toggleClass('hidden');
        });

        $('#sidebar-right').mouseleave(function () {
            $("#sidebar-right").addClass('hidden');
        });

        $('#sidebar-right').mouseenter(function () {
            $("#sidebar-right").removeClass('hidden');
        });

        $('#sidebar-left').click(function () {
            $("#sidebar-left").toggleClass('hidden');
        });

        $('#sidebar-left').mouseleave(function () {
            $("#sidebar-left").addClass('hidden');
        });

        $('#sidebar-left').mouseenter(function () {
            $("#sidebar-left").removeClass('hidden');
        });
    }

    return {
        init: function () {
            bindThemAll();
        }
    };
}());

MediaManager.init();