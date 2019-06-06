/* global $ */
/* global data */

function newMessage(message) { // Creates a message that lasts for 16 seconds for the user
    const tempID = Math.floor(Math.random() * 10000)
    $('.messages-container').prepend('<div id="'+tempID+'" class="message-wrap"><p class="message">'+message+'</p></div>')
    setTimeout(function() {
        $('#' + tempID).remove()
    }, 16010)
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

$(window).resize(checkWindowResize)

function checkWindowResize() {
    if($(window).width() > 950) {
        closeNav()
        hideOverlay()
    }
}

function hideOverlay() {
    $('.overlay').css('opacity', '0')
    setTimeout(function() {
        $('.overlay').css('z-index', '-1')
        $('body').css('overflow-y', 'auto')
    }, 200)
}

function showOverlay() { // Shows dark overlay
    $('body').css('overflow-y', 'hidden')
    $('.overlay').css('opacity', '1').css('z-index', '10')
}

function openNav() {
    $('.side-nav').addClass('open')
    showOverlay()
}

function closeNav() {
    $('.side-nav').removeClass('open')
    hideOverlay()
}

$('.open-nav-btn').click(function() {
    openNav()
})

$('.overlay').click(function() {
    if($('.side-nav').hasClass('open')) {
        closeNav()
    }
})