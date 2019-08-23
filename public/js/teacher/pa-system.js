/* global socket */
/* global $ */
/* global newMessage */

const totalChar = 250;
let charLeft = totalChar; 

$(document).ready(function() {
    charactersLeft()
})

$('.play-speech-widget .play-speech-btn').click(function() {
    if($('.play-speech-widget .speech-textbox').val().replace(/ /g, "") == "") {
            newMessage("Input is empty");
    } else {
        socket.emit("tts", $('.play-speech-widget .play-speech-content textarea').val())
    }
})

$('.play-speech-widget .speech-textbox').on('input', function() {
    charLeft = totalChar - $(this).val().length
    if(charLeft < 0) {
        charLeft = 0;
        $(this).val($(this).val().slice(0, totalChar))
    }
    charactersLeft()
})

function charactersLeft() {
    $('.play-speech-widget .char-limit').text(charLeft + " Characters Left")
}