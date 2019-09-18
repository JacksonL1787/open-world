/* global $ */
/* global moment */

$(function() { // Previous Emergencies
    
    const applyFilter = (filter) => {
        var filterText = filter
        if($('.emergency-box').length == 0) {
            $('.no-emergencies').show() 
        } else {
            if(filter === "All") {
                $('.emergency-box').show()
            } else {
                let count = 0
                $('.emergency-box').each(function(index) {
                    if(filterText == $(this).find('.type-wrap').children('p').text().replace(/ /g, "")) {
                        $(this).show()
                        count++
                    } else {
                        $(this).hide()
                    }
                })
                if(count <= 0) {
                    $('.no-emergencies').show()
                } else {
                    $('.no-emergencies').hide()
                }
            }
        }
        
    }
    
    const setInfoModalData = (id) => {
        let lockdownData;
        for(var i = 0; i < window.data.emergencies.length;i++) {
            if(window.data.emergencies[i]._id === id) {
                lockdownData = window.data.emergencies[i]
            }
        }
        $('.lockdown-info-modal .info-wrap .started-by').text(`${lockdownData.pushUser.firstName} ${lockdownData.pushUser.lastName}`)
        $('.lockdown-info-modal .info-wrap .start-time').text(moment(lockdownData.data.time).format('lll'))
        $('.lockdown-info-modal .info-wrap .end-time').text(moment(lockdownData.data.endTime).format('lll'))
        let totalTime = ""+ moment((lockdownData.data.endTime - lockdownData.data.time) + 28800000).format('hh:mm:ss')
    	if(totalTime.startsWith('12')) {
    		totalTime = "0" + totalTime.slice(2)
    	}
    	$('.lockdown-info-modal .info-wrap .total-time').text(totalTime)
    	$('.lockdown-info-modal .lockdown-desc').text(lockdownData.data.description)
    	$('.lockdown-info-modal .live-chat-wrap .message-wrap, .lockdown-info-modal .updates-wrap .update-wrap').remove()
    	$('.no-messages, .no-updates').show()
    	if(lockdownData.data.liveChat.length) {
    	    $('.no-messages').hide()
    	}
    	for(var m = 0; m < lockdownData.data.liveChat.length;m++) {
    	    $('.lockdown-info-modal .live-chat-wrap').append('<div class="message-wrap"><p><span class="time">'+moment(lockdownData.data.liveChat[m].time).format('hh:mm A')+'</span> <span class="name">'+lockdownData.data.liveChat[m].name+':</span> <span class="message">'+lockdownData.data.liveChat[m].message+'</span></p></div>')
    	}
    	if(lockdownData.data.updates.length) {
    	    $('.no-updates').hide()
    	}
    	for(var u = 0; u < lockdownData.data.updates.length;u++) {
    	    $('.lockdown-info-modal .updates-wrap').append('<div class="update-wrap"><div class="top-wrap"><p class="created-by">'+lockdownData.data.updates[u].name+'</p><p class="time">'+moment(lockdownData.data.updates[u].time).format('h:mm A')+'</p></div><p class="message">'+lockdownData.data.updates[u].message+'</p></div>')
    	}
    }
    
    const setOption = (elem) => {
        $('.previous-emergencies-widget .select-emergency-wrap .option-wrap').removeClass('active')
        elem.parent().addClass('active')
        applyFilter(elem.text())
    }

    $('.previous-emergencies-widget .select-emergency-wrap .option-wrap button').click(function() {
        setOption($(this))
    })
    
    $(document).ready(function() {
        if(window.data.emergencies.length == 0) {
            $('.no-emergencies').show()
        }
        for(var i = 0; i < window.data.emergencies.length; i++) {
            const _DATA = window.data.emergencies[i]
            if(_DATA.data.type != "Action") {
                let icon;
                if(_DATA.data.type.replace(/ /g, "") == "Lockdown") {
                    icon = 'lockdown-icon'
                }
                $('.previous-emergencies-widget .emergencies-wrap').prepend(`<div class="emergency-box" id="${_DATA._id}"><div class="emergency-icon ${icon}"></div><div class="emergency-content"><div class="name-wrap info-wrap"><label>Name</label><p>${_DATA.pushUser.lastName}, ${_DATA.pushUser.firstName}</p></div><div class="time-wrap info-wrap"><label>When</label><p>${moment(_DATA.data.time).format('lll')}</p></div><div class="type-wrap info-wrap"><label>Type</label><p>${_DATA.data.type}</p></div><button class="see-info-btn">More Information</button></div></div>`)
            }
        }
    })
    
    $('.lockdown-widget .open-lockdown-prompt').click(function() {
        $('.lockdown-modal, .lockdown-overlay').addClass('active')
    })
    
    $('.lockdown-overlay').click(function() {
        $('.lockdown-modal, .lockdown-info-modal, .lockdown-overlay').removeClass('active')
    })
    
    $('.lockdown-modal .close').click(function() {
        $('.lockdown-modal, .lockdown-overlay').removeClass('active')
    })
    
    $(document).on('click', '.previous-emergencies-widget .emergency-box .see-info-btn', function() {
        $('.lockdown-info-modal, .lockdown-overlay').addClass('active')
        const id = $(this).parent().parent().attr('id')
        setInfoModalData(id)
    })
    
    $('.lockdown-info-modal .close').click(function() {
        $('.lockdown-info-modal, .lockdown-overlay').removeClass('active')
    })
    
    $('.lockdown-modal .confirm-begin-lockdown').click(function() {
        if($('.lockdown-modal .lockdown-inpt').val().toLowerCase() == "lockdown") {
            $.ajax({
                url: "/teacher/begin-lockdown",
                type: 'POST',
                data: {
                    "additionalInfo": $('.lockdown-modal .extra-info-textarea').val()
                }
            })
        }
    })
})