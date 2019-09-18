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

function lockDoor() { // Lock Door
    $('.door-control-widget .lock-status').text('Locked')
    $('.door-control-widget .change-lock-status-btn').text('Unlock')
    socket.emit('doorLock', 'doorLock')
}

function unlockDoor() { // Unlock Door
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

function openBlinds() {
    if(window.data.rooms[0].devices.blinds != "open") {
        socket.emit('blindsOpen', 'test')
        window.data.rooms[0].devices.blinds = "open"
        socket.emit('updateBlindsDB', {room: data.rooms[0].roomNumber, state: "open"})
    }
}

function closeBlinds() {
    if(window.data.rooms[0].devices.blinds != "close") {
        socket.emit('blindsClose', 'test')
        window.data.rooms[0].devices.blinds = "close"
        socket.emit('updateBlindsDB', {room: data.rooms[0].roomNumber, state: "close"})
    }
}


// Lighting Control Functions

function turnOffLights() {
    socket.emit('lightsOff', 'lightsOff')
}

function turnOnLights() {
    socket.emit('lightsOn', 'lightsOn')
}

function changeBrightness(msg) {
    socket.emit('lightsBrightness', msg)
}

function mapTemp(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function updateClimateGuage(temp) {
    if(temp > 85) {
        temp = 85
        $('.climate-guage-wrap .cover .current-temp').text(`>${temp}°F`)
    } else if(temp < 55) {
        temp = 55
        $('.climate-guage-wrap .cover .current-temp').text(`<${temp}°F`)
    } else {
        $('.climate-guage-wrap .cover .current-temp').text(`${temp}°F`)
    }
    socket.emit('currentClimate', {room: window.data.rooms[0].roomNumber,value: temp})
    const rotate = mapTemp(temp, 55, 85, 10, 180)
    $('.climate-guage-wrap .border-cover').css('transform', `translateX(-50%) rotate(${rotate}deg`)
}




/*
    EVENT LISTENERS
*/

$(document).ready(function() {
    let room = window.data.rooms[0]
    if(room.devices.lightSwitch) {
        $('.lighting-control-widget .lighting-controls .light-switch-wrap .switch').addClass('active')
    }
    if(room.devices.projector) {
        projectorOn()
    }
    if(room.devices.doorLock) {
        lockDoor()
    }
    $('.lighting-control-widget .lighting-controls .brightness-range-input').val(room.devices.lightBrightness)
    $('.climate-control-widget .set-climate-wrap .current-set-temp').text(`${room.devices.setTemp}°F`);
    updateClimateGuage(room.devices.currentTemp)
})

// Listen for click on turn on or off projector button
$('.projector-control-widget .change-projector-status-btn').click(function() {
    if($('.status-light').hasClass('on')) {
        loading('.change-projector-status-btn', 1500, projectorOff, projectorWaiting,'top: calc(50% + 17px)')
        socket.emit('projectorUpdateDB', {room: data.rooms[0].roomNumber, state: false})
    } else {
        loading('.change-projector-status-btn', 1500, projectorOn, projectorWaiting,'top: calc(50% + 17px)')
        socket.emit('projectorUpdateDB', {room: data.rooms[0].roomNumber, state: true})
    }
})

// Listen for click on click on lock or unlock button
$('.door-control-widget .change-lock-status-btn').click(function() {
    if($('.door-control-widget .lock-status').text() == "Locked") {
        loading('.change-lock-status-btn', 1500, unlockDoor, unlockingDoor, 'top: calc(50% + 17px)')
        socket.emit('doorLockUpdateDB', {room: data.rooms[0].roomNumber, state: false})
    } else {
        loading('.change-lock-status-btn', 1500, lockDoor, lockingDoor, 'top: calc(50% + 17px)')
        socket.emit('doorLockUpdateDB', {room: data.rooms[0].roomNumber, state: true})
    }
})

$('.blinds-control-widget .preset-controls .open-blinds-btn').click(function() {
    loading('.blind-controls-wrap', 2000, openBlinds, done, 'top: calc(50% + 30px)')
    
})

$('.blinds-control-widget .preset-controls .close-blinds-btn').click(function() {
    loading('.blind-controls-wrap', 2000, closeBlinds, done, 'top: calc(50% + 30px)')
})

$('.lighting-control-widget .lighting-controls .light-switch-wrap .switch').click(function() {
    if($(this).hasClass('active')) {
        turnOffLights()
        socket.emit('lightSwitchUpdateDB', {room: data.rooms[0].roomNumber, state: false})
    } else {
        turnOnLights()
        socket.emit('lightSwitchUpdateDB', {room: data.rooms[0].roomNumber, state: true})
    }
    $(this).toggleClass('active')
})

$('.lighting-control-widget .lighting-controls .brightness-range-input').on('input', function() {
    const brightness = Math.round($(this).val() * 2.55)
    socket.emit('lightBrightnessUpdateDB', {room: data.rooms[0].roomNumber, value: $(this).val()})
    changeBrightness('lightingBrightness:' + brightness)
})

$('.climate-control-widget .set-climate-wrap .climate-control').click(function() {
    if($(this).hasClass('climate-up')) {
        let newTemp = parseInt($('.climate-control-widget .set-climate-wrap .current-set-temp').text().split("°")[0]) + 1
        
        if(newTemp <= 80) {
            $('.climate-control-widget .set-climate-wrap .current-set-temp').text(`${newTemp}°F`);
            if(newTemp >= 70) {
                socket.emit('fanOff')
            }
            socket.emit('setTempUpdateDB', {room: data.rooms[0].roomNumber, value: newTemp})
        }
    } else if ($(this).hasClass('climate-down')) {
        let newTemp = parseInt($('.climate-control-widget .set-climate-wrap .current-set-temp').text().split("°")[0]) - 1
        
        if(newTemp >= 60) {
            $('.climate-control-widget .set-climate-wrap .current-set-temp').text(`${newTemp}°F`);
            if(newTemp < 70) {
                socket.emit('fanOn')
            }
            socket.emit('setTempUpdateDB', {room: data.rooms[0].roomNumber, value: newTemp})
        }
        
    }
})

var colorPicker = new iro.ColorPicker('#color-picker-container', {
    layout: [
        {
          component: iro.ui.Wheel,
          options: {
              width: 175
          }
        }
    ]
});

colorPicker.color.hexString = window.data.rooms[0].devices.lightingColor // Set Color Picker color to hex string saved in Database

colorPicker.on('color:change', function(color, changes){
    var msg = "lightingColor:" + color.rgb.r + "," + color.rgb.g + "," + color.rgb.b
    window.data.rooms[0].devices.lightingColor = color.hexString
    socket.emit('lightingColorUpdateDB', {room: window.data.rooms[0].roomNumber,color: color.hexString})
    socket.emit('lightingColor', msg)
})



/*

    SOCKET FUNCTIONS
    
*/

socket.on('updateCurrentTemperature', function(data) {
    const temp = (parseInt(data) * 1.8) + 32
    updateClimateGuage(Math.round(temp))
})