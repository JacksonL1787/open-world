/*global $*/

$('.home-btn-wrap').click(function() {
    window.location.href="/teacher/home"
})

$('.attendance-btn-wrap').click(function() {
    window.location.href="/teacher/attendance"
})

$('.pa-system-btn-wrap').click(function() {
    window.location.href="/teacher/pa-system"
})

$('.manage-students-btn-wrap').click(function() {
    window.location.href="/teacher/manage-students"
})

$('.classroom-controls-btn-wrap').click(function() {
    window.location.href="/teacher/classroom-controls"
})

$('.side-nav .bottom .settings-btn').click(function() {
    window.location.href="/teacher/settings"
})

$('.side-nav .bottom .logout-btn').click(function() {
    window.location.href="/auth/logout"
})

// Makes navbar items active based on current page
$(document).ready(function() {
    if(window.location.pathname == "/teacher/home") {
        $('.home-btn-wrap').addClass('active')
    } else if (window.location.pathname == "/teacher/attendance") {
        $('.attendance-btn-wrap').addClass('active')
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