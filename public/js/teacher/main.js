/* global $ */

function newMessage(message) {
    const tempID = Math.floor(Math.random() * 10000)
    $('.messages-container').prepend('<div id="'+tempID+'" class="message-wrap"><p class="message">'+message+'</p></div>')
    setTimeout(function() {
        $('#' + tempID).remove()
    }, 16010)
}