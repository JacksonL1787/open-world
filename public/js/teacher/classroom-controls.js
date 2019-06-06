/* global $ */
/* global socket */
/* global data */
/* global loading */

/*
    FUNCTIONS
*/

function done() {
    console.log("done")
}

// Projector Functions

function projectorOn() {
    $('.status-light').addClass('on').removeClass('waiting').removeClass('off')
    $('.projector-control-widget .change-projector-status-btn').text('Turn Off')
    socket.emit('projectorOn', 'on')
}

function projectorWaiting() {
    $('.status-light').removeClass('on').removeClass('off').addClass('waiting')
}

function projectorOff() {
    $('.status-light').removeClass('on').removeClass('waiting').addClass('off')
    $('.projector-control-widget .change-projector-status-btn').text('Turn On')
    socket.emit('projectorOff', 'off')
}


// Door Locking Functions

function lock() { // Lock Door
    $('.door-control-widget .lock-status').text('Locked')
    $('.door-control-widget .change-lock-status-btn').text('Unlock')
    socket.emit('doorLock', 'doorLock')
}

function unlock() { // Unlock Door
    $('.door-control-widget .lock-status').text('Unlocked')
    $('.door-control-widget .change-lock-status-btn').text('Lock')
    socket.emit('doorUnlock', 'doorUnlock')
}

function lockingDoor() { // Show Unlocking Door Status
    $('.door-control-widget .lock-status').text('Locking...')
}

function unlockingDoor() { // Show Unlocking Door Status
    $('.door-control-widget .lock-status').text('Unlocking...')
}


// Blind Control Functions

function checkBlinds() {
    let check = true;
    if(check) {
        $('.blinds-control-widget .blinds-control-error').hide()
    }
    return check
}

function moveBlindsUp() {
    
}

function moveBlindsDown() {
    
}

function openBlinds() {
    socket.emit('blindsOpen', 'test')
}

function closeBlinds() {
    socket.emit('blindsClose', 'test')
}

function blindsError(msg) {
    $('.blinds-control-widget .blinds-control-error').show()
    $('.blinds-control-widget .blinds-control-error').text(msg)
}


// Lighting Control Functions

function turnOffLights() {
    socket.emit('lightsOff', 'lightsOff')
}

function turnOnLights() {
    socket.emit('lightsOn', 'lightsOn')
}



/*
    EVENT LISTENERS
*/

// Listen for click on turn on or off projector button
$('.projector-control-widget .change-projector-status-btn').click(function() {
    if($('.status-light').hasClass('on')) {
        loading('.change-projector-status-btn', 0, projectorOff, projectorWaiting,'top: calc(50% + 17px)')
    } else {
        loading('.change-projector-status-btn', 0, projectorOn, projectorWaiting,'top: calc(50% + 17px)')
    }
})

// Listen for click on click on lock or unlock button
$('.door-control-widget .change-lock-status-btn').click(function() {
    console.log($('.door-control-widget .lock-status').text())
    if($('.door-control-widget .lock-status').text() == "Locked") {
        loading('.change-lock-status-btn', 2000, unlock, unlockingDoor, 'top: calc(50% + 17px)')
    } else {
        loading('.change-lock-status-btn', 2000, lock, lockingDoor, 'top: calc(50% + 17px)')
    }
})

$('.blinds-control-widget .preset-controls .open-blinds-btn').click(function() {
    if(checkBlinds()) {
        loading('.blind-controls-wrap', 2000, openBlinds, done, 'top: calc(50% + 30px)')
    } else {
        blindsError("The blinds are already open.")
    }
    
})

$('.blinds-control-widget .preset-controls .close-blinds-btn').click(function() {
    if(checkBlinds()) {
        loading('.blind-controls-wrap', 2000, closeBlinds, done, 'top: calc(50% + 30px)')
    } else {
        blindsError("The blinds are already closed.")
    }
})

$('.lighting-control-widget .lighting-controls .light-switch-wrap .switch').click(function() {
    if($(this).hasClass('active')) {
        turnOffLights()
    } else {
        turnOnLights()
    }
    $(this).toggleClass('active')
})

$('.lighting-control-widget .lighting-controls .brightness-range-input').on('input', function() {
    
})

var colorPicker = new iro.ColorPicker('#color-picker-container');