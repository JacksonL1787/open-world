/* global $ */
/* global data */
/* global newMessage */
/* global moment */
/* global openModal */
/* global closeModal */

function setBasicInformation() {
    $('.basic-info-widget .name-wrap p').text(data.student.firstName + " " + data.student.lastName)
    $('.basic-info-widget .email-wrap a').attr('href', 'mailto:' + data.student.email)
    $('.basic-info-widget .email-wrap a').text(data.student.email)
    $('.basic-info-widget .grade-wrap p').text(data.student.grade)
    $('.basic-info-widget .student-id-wrap p').text(data.student.studentID)
    $('.basic-info-widget .advisor-wrap p').text(data.student.advisor.lastName + ", " + data.student.advisor.firstName)
    $('.basic-info-widget .advisor-email-wrap a').attr('href', 'mailto:' + data.student.advisor.email)
    $('.basic-info-widget .advisor-email-wrap a').text(data.student.advisor.email)
}

function setScheduleInformation() {
    const classes = data.student.classes
    for(var i = 0; i < classes.length;i++) {
        const wrapElem = $('.schedule-widget .day-schedule-wrap .period-' + (i+1) + '-wrap')
        wrapElem.children('span').text(classes[i].title)
        wrapElem.children('.period-info-menu').children('.teacher-name-info').children('p').text(classes[i].teacher.lastName + ", " + classes[i].teacher.firstName || "N/A")
        wrapElem.children('.period-info-menu').children('.teacher-email-info').children('p').text(classes[i].teacher.email || "N/A")
        wrapElem.children('.period-info-menu').children('.room-info').children('p').text(classes[i].room || "N/A")
    }
}

function setNotes() {
    if(data.student.notes) {
        if(data.student.notes.length != 0) {
            for(var i = 0;i<data.student.notes.length;i++) {
                addNote(data.student.notes[i])
            }
        } else {
            $('.notes-widget .all-notes-wrap .no-notes').show()
        }
    } else {
       $('.notes-widget .all-notes-wrap .no-notes').show() 
    }
}

function addNote(noteData) {
    $('.notes-widget .all-notes-wrap .no-notes').hide()
    $('.notes-widget .all-notes-wrap').prepend('<div class="note-wrap" id="'+noteData.noteID+'"><div class="created-by-wrap"><label>Created By</label><p>'+noteData.creator+'</p></div><div class="date-created-wrap"><label>Date Created</label><p>'+moment(parseInt(noteData.date)).format('L')+'</p></div><div class="message-wrap"><label>Message</label><p>'+noteData.message+'</p></div><div class="delete-note"><p>&#10005;</p></div></div>')
}

function removeNote(id) {
    console.log(id)
    $('.all-notes-wrap #' + id).remove()
    for(var i = 0; i < data.student.notes.length; i++) {
        if(data.student.notes[i].noteID == id) {
            data.student.notes.splice(i, 1);
            break;
        }
    }
    if(data.student.notes.length == 0) {
        $('.notes-widget .all-notes-wrap .no-notes').show()
    }
}

$(document).ready(function() {
    setBasicInformation()
    setScheduleInformation()
    setNotes()
})

$(document).on('click', '.notes-widget .note-wrap .delete-note', function() {
    let elem = $(this)
    openModal('delete-note-modal', function() {
        $('.delete-note-modal .confirm-delete-note').attr('id', elem.parent('.note-wrap').attr('id'))
    })
    
})

$('.delete-note-modal .confirm-delete-note').click(function() {
    closeModal('delete-note-modal')
    const ajaxData = {
        noteID: $(this).attr('id'),
        student: data.student.studentID
    }
    $.ajax({
        type: "POST",
        url: "/teacher/student/delete-note",
        data: ajaxData,
        success: function() {
            window.location.reload();
        }
    })
})

$('.notes-widget .add-note-wrap .add-note-btn').click(function() {
    if($('.notes-widget .add-note-wrap .note-input').val().trim() != "") {
        const noteData = {
            creator: data.user.firstName + " " + data.user.lastName,
            date: Date.now(),
            message: $('.notes-widget .add-note-wrap .note-input').val(),
            noteID: Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)
        }
        const ajaxData = {
            ...noteData,
            student: data.student.studentID
        }
        $.ajax({
            type: "POST",
            url: "/teacher/student/add-note",
            data: ajaxData,
            success: function() {
                addNote(noteData)
                $('.notes-widget .add-note-wrap .note-input').val("")
            }
        })
    } else {
        newMessage("Input is empty")
    }
})