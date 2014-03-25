var MediaManager = (function () {
    'use strict';

    function bindThemAll() {
        $('#settings-button').click(function () {
            $(".sidebar-right").toggleClass('sidebar-gone');
        });

        $('#settings-button').mouseenter(function () {
            $(".sidebar-right").removeClass('sidebar-gone');
        });

        $('#settings-button').mouseleave(function () {
            $(".sidebar-right").addClass('sidebar-gone');
        });

        $('#actions-button').click(function () {
            $(".sidebar-left").toggleClass('sidebar-gone');
        });

        $('#actions-button').mouseenter(function () {
            $(".sidebar-left").removeClass('sidebar-gone');
        });

        $('#actions-button').mouseleave(function () {
            $(".sidebar-left").addClass('sidebar-gone');
        });

        $('.sidebar-right').click(function () {
            $(".sidebar-right").toggleClass('sidebar-gone');
        });

        $('.sidebar-right').mouseleave(function () {
            $(".sidebar-right").addClass('sidebar-gone');
        });

        $('.sidebar-right').mouseenter(function () {
            $(".sidebar-right").removeClass('sidebar-gone');
        });

        $('.sidebar-left').click(function () {
            $(".sidebar-left").toggleClass('sidebar-gone');
        });

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