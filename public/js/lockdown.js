/* global $ */
/* global socket */
/* global moment */

	
const addMessage = (msgData) => {
	let autoScroll = false
	console.log($('.messages-wrap').innerHeight() + $('.messages-wrap').scrollTop())
	console.log($('.messages-wrap').offset().top)
	if($('.messages-wrap').innerHeight() + $('.messages-wrap').scrollTop() >= $('.messages-wrap').offset().top) {
		autoScroll = true
	}
	$('.chat-wrap .messages-wrap .no-messages').hide()
	$('.messages-wrap').append('<div class="message-wrap"><p><b class="time">'+moment(msgData.time).format('h:mm')+'</b> <b class="name">'+msgData.name+': </b> <b class="message">'+msgData.message+'</b></p></div>')
	
	if(autoScroll) {
		$('.messages-wrap').scrollTop($('.messages-wrap').height() + $('.messages-wrap').scrollTop()) 
	}
}

const addUpdateConform = () => {
	$('.chat-wrap .messages-wrap .no-messages').hide()
	$('.messages-wrap').append('<div class="message-wrap"><p class="confirm-update">Update has been added.</p></div>')
}

const addUpdate = (msgData) => {
	console.log('NEW UPDATE: ' + msgData.message)
	$('.main-wrap .update-outer-wrap .inner-update-wrap').prepend('<div class="update-wrap"><div class="top-wrap"><p class="created-by">'+msgData.name+'</p><p class="time">'+moment(msgData.time).format('h:mm A')+'</p></div><p class="message">'+msgData.message+'</p></div>')
}

const emitMessage = () => {
	if($('.sender-wrap .message-inpt').val().replace(/ /g, "").length != 0) {
		socket.emit('lockdown-msg', {
			time: Date.now(),
			name: window.data.user.firstName + " " + window.data.user.lastName,
			message: $('.sender-wrap .message-inpt').val()
		})
		$('.sender-wrap .message-inpt').val("")
	}
}

const setTime = () => {
	let time = ""+ moment((Date.now() - window.data.currentLockdown.startTime) + 28800000).format('hh:mm:ss')
	if(time.startsWith('12')) {
		time = "0" + time.slice(2)
	}
	$('.content .header-wrap .lockdown-length span').text(time)
}

setInterval(function() {
	setTime()
}, 1000)

$(document).ready(function() {
	setTime()
	for(var i = 0; i < window.data.currentLockdown.liveChat.length;i++) {
		addMessage(window.data.currentLockdown.liveChat[i])
	}
	for(var i = 0; i < window.data.currentLockdown.updates.length;i++) {
		addUpdate(window.data.currentLockdown.updates[i])
	}
})

socket.on('add-lockdown-msg', function(data) {
	addMessage(data)
})

socket.on('add-lockdown-update', function(data) {
	addUpdate(data)
})

socket.on('updated-added-confirm', function() {
	addUpdateConform()
})

socket.on('teacher-dashboard-redirect', function() {
	window.location.href="/dashboard"
})

$('.sender-wrap .send-message').click(function(){
	emitMessage()
})

$(document).keypress(function(e) {
	if(e.keyCode == 13) {
		if($('.sender-wrap .message-inpt').is(':focus')) {
			emitMessage()
		}
	}
})

$('.end-lockdown').click(function() {
	$('.end-lockdown-modal, .modal-overlay').addClass('active')
})

$('.end-lockdown-modal .close').click(function() {
	$('.end-lockdown-modal, .modal-overlay, .incorrect').removeClass('active')
})

$('.end-lockdown-modal .confirm-end-lockdown').click(function() {
	$.ajax({
		url: '/end-lockdown',
		type: 'POST',
		data: {password: $('.end-lockdown-modal .password-inpt').val()},
		success: function(data) {
			if(data.status == "failure") {
				$('.incorrect').addClass('active')
			}
		}
	})
})

$('.modal-overlay').click(function() {
	$('.end-lockdown-modal, .modal-overlay, .incorrect').removeClass('active')
})