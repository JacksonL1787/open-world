/*global $*/
/* global hideOverlay */
/* global showOverlay */



$('.home-btn-wrap').click(function() {
    window.location.href="/teacher/home" // Redirects to home page
})

$('.pa-system-btn-wrap').click(function() {
    window.location.href="/teacher/pa-system" // Redirects to pa system page
})

$('.manage-students-btn-wrap').click(function() {
    window.location.href="/teacher/manage-students" // Redirects to manage students page
})

$('.classroom-controls-btn-wrap').click(function() {
    window.location.href="/teacher/classroom-controls" // Redirects to classroom controls page
})

$('.side-nav .bottom .settings-btn').click(function() {
    window.location.href="/teacher/settings" // Redirects to settings page
})

$('.side-nav .bottom .logout-btn').click(function() {
    window.location.href="/auth/logout" // Logs user out
})

// Makes navbar items active based on current page
$(document).ready(function() {
    if(window.location.pathname == "/teacher/home") {
        $('.home-btn-wrap').addClass('active')
    } else if (window.location.pathname == "/teacher/pa-system") {
        $('.pa-system-btn-wrap').addClass('active')
    } else if (window.location.pathname == "/teacher/manage-students") {
        $('.manage-students-btn-wrap').addClass('active')
    } else if (window.location.pathname == "/teacher/classroom-controls") {
        $('.classroom-controls-btn-wrap').addClass('active')
    } else if (window.location.pathname == "/teacher/settings") {
        $('.side-nav .bottom .settings-btn').addClass('active')
    }
})