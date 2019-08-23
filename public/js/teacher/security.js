/* global $ */
/* global moment */

$(function() { // Previous Emergencies
    
    const applyFilter = (filter) => {
        var filterText = filter
        if(filter === "All") {
            $('.emergency-box').show()
        } else {
            $('.emergency-box').each(function(index) {
                if(filterText == $(this).find('.type-wrap').children('p').text().replace(/ /g, "")) {
                    $(this).show()
                } else {
                    $(this).hide()
                }
            })
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
        for(var i = 0; i < window.data.emergencies.length; i++) {
            const _DATA = window.data.emergencies[i]
            if(_DATA.data.type != "Action") {
                let icon;
                if(_DATA.data.type.replace(/ /g, "") == "Lockdown") {
                    icon = 'lockdown-icon'
                }
                $('.previous-emergencies-widget .emergencies-wrap').append(`<div class="emergency-box" id="${_DATA._id}"><div class="emergency-icon ${icon}"></div><div class="emergency-content"><div class="name-wrap info-wrap"><label>Name</label><p>${_DATA.pushUser.lastName}, ${_DATA.pushUser.firstName}</p></div><div class="time-wrap info-wrap"><label>When</label><p>${moment(_DATA.data.time).format('lll')}</p></div><div class="type-wrap info-wrap"><label>Type</label><p>${_DATA.data.type}</p></div><button class="see-info-btn">More Information</button></div></div>`)
            }
        }
    })
    
    $('.lockdown-widget .open-lockdown-prompt').click(function() {
        $('.lockdown-modal, .lockdown-overlay').addClass('active')
    })
    
    $('.lockdown-modal .close').click(function() {
        $('.lockdown-modal, .lockdown-overlay').removeClass('active')
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