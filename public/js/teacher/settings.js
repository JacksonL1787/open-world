/* global $*/
/* global data*/
/* global newMessage */

$(document).ready(function() {
    $('.change-settings-form .profile-picture-wrap .profile-pic').css('background-image', 'url(/uploads/'+data.user.profilePicture+')')
    $('.change-settings-form .settings-option-wrap .firstname').val(data.user.firstName)
    $('.change-settings-form .settings-option-wrap .lastname').val(data.user.lastName)
    $('.change-settings-form .settings-option-wrap .email').val(data.user.email)
})

$('.change-settings-form .profile-picture-wrap .hover-wrap').click(function() {
    $('.profile-picture-upload').click()
})

$('.profile-picture-upload').on('change', function(){
    readURL(this);
});

var readURL = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.change-settings-form .profile-picture-wrap .profile-pic').css('background-image', 'url('+e.target.result+')');
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$('.update-basic-settings-btn').click(function() {
    let imageData = new FormData() // Creates Form Data
    const profilePic = $('.change-settings-form .profile-picture-upload')[0].files[0] // Gets Profile Picture Uploaded
    const firstName = $('.change-settings-form .settings-option-wrap .firstname').val()
    const lastName = $('.change-settings-form .settings-option-wrap .lastname').val()
    const email = $('.change-settings-form .settings-option-wrap .email').val()
    if(firstName.replace(/ /g, "").length == 0) {
        newMessage("First Name is required")
    } else if (lastName.replace(/ /g, "").length == 0) {
        newMessage("Last Name is required")
    } else if (email.replace(/ /g, "").length == 0) {
        newMessage("Email is required")
    } else if (!email.includes("@") && !email.includes(".")) {
        newMessage("Invalid Email")
    } else {
        if(profilePic) {
            imageData.append('file', profilePic)
            $.ajax({ // AJAX Function to update profile picture in DB
                url: "/teacher/update/profile-picture",
                type: "POST",
                data: imageData,
                contentType: false,
                processData: false
            })
        }
        
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email
        }
        $.ajax({
            url: "/teacher/update/user-data",
            type: "POST",
            data: data
        })
        newMessage("Profile Information Updated")
    }
    
})

$('.change-password-widget .change-password-btn').click(function() {
    const password =  $('.change-password-widget .change-password-form .new-password').val()
    const confirmPassword =  $('.change-password-widget .change-password-form .confirm-password').val()
    if(password == confirmPassword) {
        var data = {
            password: password,
            confirmPassword: confirmPassword
        }
        $.ajax({
            url: "/teacher/update/password",
            type: "POST",
            data: data,
            success: function() {
                $('.change-password-widget .change-password-form .new-password').val("")
                $('.change-password-widget .change-password-form .confirm-password').val("")
            }
        })
        newMessage("Password Changed")
    } else {
        newMessage("Passwords don't match")
    }
})