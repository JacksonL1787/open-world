/* global $ */
/* global data */
/* global socket */

socket.on('lockdown-screen-redirect', function() {
    window.location.href="/teacher/lockdown"
})

function newMessage(message) { // Creates a message that lasts for 16 seconds for the user
    const tempID = Math.floor(Math.random() * 10000)
    $('.messages-container').prepend('<div id="'+tempID+'" class="message-wrap"><p class="message">'+message+'</p></div>')
    setTimeout(function() {
        $('#' + tempID).remove()
    }, 10010)
}

function loading(container, time, callback, startFunction, style) { // Shows Loading Bar in container
    $(container).hide()
    startFunction()
    $(container).parent().append(data.loader)
    $(container).siblings('.loader').attr('style', style)
    setTimeout(function() {
        $(container).siblings('.loader').remove()
        $(container).show()
        callback()
    }, time)
}

function done() {
    return;
}

$(window).resize(checkWindowResize)
$(document).ready(checkWindowResize())

function checkWindowResize() {
    if($(window).width() > 950) {
        closeNav()
        hideOverlay()
        closeModal('modal')
        $('.side-nav').css('z-index', '25')
    } else  {
        $('.side-nav').css('z-index', '75')
        closeModal('modal')
    }
}

function hideOverlay() { // HIDES dark overlay
    $('.overlay').css('opacity', '0')
    setTimeout(function() {
        $('.overlay').css('z-index', '-1')
        $('body').css('overflow-y', 'auto')
    }, 200)
}

function showOverlay() { // SHOWS dark overlay
    $('body').css('overflow-y', 'hidden')
    $('.overlay').css('opacity', '1').css('z-index', '50')
}

function openNav() { // OPENS Navbar on smaller screens
    $('.side-nav').addClass('open')
    showOverlay()
}

function closeNav() { // CLOSES Navbar on smaller screens
    $('.side-nav').removeClass('open')
    hideOverlay()
}

function openModal(modal, customFunction) { // OPENS Modal based on class name provided
    $('.' + modal).css('z-index', '100')
    $('.' + modal).addClass('active')
    showOverlay()
    customFunction()
}

function closeModal(modal) { // CLOSES Modal based on class name
    $('.' + modal).removeClass('active')
    hideOverlay()
    setTimeout(function() {
        $('.' + modal).css('z-index', '-1')
    }, 350)
}

$('.open-nav-btn').click(function() {
    openNav()
})

$('.close-nav-btn').click(function() {
    closeNav()
})

$('.modal .modal-top .close').click(function() {
    const modalClass = $(this).parent().parent().attr('class').split(" ")[1]
    console.log(modalClass)
    closeModal(modalClass)
})

$('.overlay').click(function() {
    if($('.side-nav').hasClass('open')) {
        closeNav()
    }
})