/* global $*/
/* global data*/
/* global newMessage */

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) { // Execute function after loading the file uploaded by user
            // Sets background image of profile picture
            $('.change-settings-form .profile-picture-wrap .profile-pic').css('background-image', 'url('+e.target.result+')');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function changeDarkMode(status) {
    const data = {status: status}
    $.ajax({
        url: "/teacher/dark-mode",
        type: "POST",
        data: data,
        success: function() {
            window.location.reload()
        }
    })
}


$(document).ready(function() {
    // Adds data to different elements based on user data
    $('.change-settings-form .profile-picture-wrap .profile-pic').css('background-image', 'url(/uploads/'+data.user.profilePicture+')')
    $('.change-settings-form .settings-option-wrap .firstname').val(data.user.firstName)
    $('.change-settings-form .settings-option-wrap .lastname').val(data.user.lastName)
    $('.change-settings-form .settings-option-wrap .email').val(data.user.email)
})

// Redirects click on profile picture to click on file input
$('.change-settings-form .profile-picture-wrap .hover-wrap').click(function() {
    $('.profile-picture-upload').click()
})

// Checks for file upload
$('.profile-picture-upload').on('change', function(){
    readURL(this); // Reads file input data and sets profile picture on frontend to file uploaded
});


// Checks for click on Update Settings button
$('.update-basic-settings-btn').click(function() {
    let imageData = new FormData() 
    const profilePic = $('.change-settings-form .profile-picture-upload')[0].files[0] // Gets Profile Picture Uploaded
    const firstName = $('.change-settings-form .settings-option-wrap .firstname').val()
    const lastName = $('.change-settings-form .settings-option-wrap .lastname').val()
    const email = $('.change-settings-form .settings-option-wrap .email').val()
    if(firstName.replace(/ /g, "").length == 0) { // Checks that First Name input isn't empty
        newMessage("First Name is required")
    } else if (lastName.replace(/ /g, "").length == 0) { // Checks that Last Name input isn't empty
        newMessage("Last Name is required")
    } else if (email.replace(/ /g, "").length == 0) { // Checks that Email input isn't empty
        newMessage("Email is required")
    } else if (!email.includes("@") && !email.includes(".")) { // Checks that Email input contains a valid email
        newMessage("Invalid Email")
    } else {
        if(profilePic) { // Checks to see if there is a new profile picture to upload
            imageData.append('file', profilePic)
            $.ajax({ // POST function to update user profile picture
                url: "/teacher/update/profile-picture",
                type: "POST",
                data: imageData,
                contentType: false,
                processData: false
            })
        }
        
        const data = { // initializes data object to update the user object 
            firstName: firstName,
            lastName: lastName,
            email: email
        }
        $.ajax({ // POST function toi update user data (first name, last name, and email)
            url: "/teacher/update/user-data",
            type: "POST",
            data: data
        })
        newMessage("Profile Information Updated") // Notifies user that their information has been updated
    }
    
})

// Checks for click on change password button
$('.change-password-widget .change-password-btn').click(function() {
    const password =  $('.change-password-widget .change-password-form .new-password').val()
    const confirmPassword =  $('.change-password-widget .change-password-form .confirm-password').val()
    if(password == confirmPassword) {
        var data = {
            password: password,
            confirmPassword: confirmPassword
        }
        $.ajax({ // POST function to update user password
            url: "/teacher/update/password",
            type: "POST",
            data: data,
            success: function() {
                // Clears Password inputs
                $('.change-password-widget .change-password-form .new-password').val("")
                $('.change-password-widget .change-password-form .confirm-password').val("")
            }
        })
        newMessage("Password Changed") // Notifies user that their password has changed
    } else {
        newMessage("Passwords don't match") // Notifies user that their passwords don't match
    }
})

// Checks for Dark Mode Switch Click
$('.dashboard-settings-widget .dark-mode-wrap .switch').click(function() {
    if($(this).hasClass('active')) { // Turn off dark mode
        changeDarkMode(false)
        
    } else { // Turn on dark mode
        changeDarkMode(true)
    }
    $(this).toggleClass('active')
})