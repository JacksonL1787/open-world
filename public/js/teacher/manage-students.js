/* global $ */
/* global data */



/*
    VARIABLE DECLARATION
*/

let filters = [] // Array for filters

// Sorts Student Array Alphabetically
data.students.sort(function(a, b) {
    var textA = a.lastName.toUpperCase();
    var textB = b.lastName.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});



/* 
    FUNCTIONS
*/

// Adds Filter to Search
function addFilter(filterClass, filterName) {
    filters.push(filterName);
    showStudents()
    $('.active-filters-widget .active-filters-wrap').prepend('<div class="filter-wrap '+filterClass+'"><p class="filter-name">'+filterName+'</p><div class="close-filter"></div></div>');
    $('.filters-menu .' + filterClass.replace("filter", "option") + " .change-filter-state").text("-").addClass('active')
}

// Removes Filter From Search
function removeFilter(filterClass, filterName) {
    const filterIndex = filters.indexOf(filterName)
    filters.splice(filterIndex, 1)
    showStudents()
    $('.' + filterClass).remove()
    $('.filters-menu .' + filterClass.replace("filter", "option") + " .change-filter-state").text("+").removeClass('active')
}

function appendStudent(data) { // Appends student to students widget
    $('.all-students-widget .students-container').append('<div class="student-wrap"><div class="student-content"><div class="student-info name-info"><label>Name</label><p class="name">'+data.firstName+' '+data.lastName+'</p></div><div class="student-info email-info"><label>Email</label><a class="email" href="mailto:'+data.email+'">'+data.email+'</a></div><div class="student-info grade-info"><label>Grade</label><p class="grade">'+data.grade+'</p></div><div class="student-info advisor-info"><label>Advisor</label><p class="advisor">'+data.advisor.lastName+', '+data.advisor.firstName+'</p></div><button class="manage-student">Manage</button></div></div>')
}

function showStudents() { // Shows students based on what is in search bar and filters
    const searchVal = $('.search-bar-widget .search-student-content .student-search-input').val().toUpperCase()
    $('.all-students-widget .students-container').empty();
    for(var i=0;i<data.students.length;i++) {
        const fullName = data.students[i].firstName + " " + data.students[i].lastName
        // Declaring variables for filter checks
        let gradeFilterCheck = false;
        let periodFilterCheck = false;
        if(filters.length > 0) { // Checks for active filters
            // Checks to see if there are any class period filters active
            if(filters.includes("Period 1") || filters.includes("Period 2") || filters.includes("Period 3") || filters.includes("Period 4") || filters.includes("Period 5") || filters.includes("Period 6")) {
                // Checks to see if student is in the teacher's class period
                for(var j=0;j<6;j++) {
                    if(data.students[i].classes) { // Prevents Error if student has no class data
                        if(filters.includes("Period " + (j+1)) && data.students[i].classes[j].teacher.email == data.user.email) {
                            periodFilterCheck = true
                            break;
                        }
                    }
                }
            } else {
                periodFilterCheck = true
            }
            // Checks to see if there are any grade filters active
            if(filters.includes("Freshman") || filters.includes("Sophomore") || filters.includes("Junior") || filters.includes("Senior")) {
                // Checks to see if student is in a certain grade
                if((filters.includes("Freshman") && data.students[i].grade == "Freshman") || (filters.includes("Sophomore") && data.students[i].grade == "Sophomore") || (filters.includes("Junior") && data.students[i].grade == "Junior") || (filters.includes("Senior") && data.students[i].grade == "Senior")) {
                    gradeFilterCheck = true
                } 
            } else {
                gradeFilterCheck = true
            }
        } else {
            // If no active filters then don't check for them
            periodFilterCheck = true
            gradeFilterCheck = true
        }
        // Checks to make sure that there are active filters or that the search bar is not empty
        if(searchVal.replace(/ /g, "") != "" || filters.length > 0) {
            // Run check on filters and search bar
            if((data.students[i].firstName.toUpperCase().startsWith(searchVal) || data.students[i].lastName.toUpperCase().startsWith(searchVal) || fullName.toUpperCase().startsWith(searchVal) || data.students[i].email.toUpperCase().startsWith(searchVal)) && (gradeFilterCheck && periodFilterCheck)) {
                appendStudent(data.students[i]) // Append student to Students Widget if all checks are correct
            }
        } else {
            appendStudent(data.students[i]) // Append student to Students Widget if no filter or search
        }
        
    }
}


/*
    EVENT LISTENERS
*/

// Opens filter menu when "Filters" button is clicked
$('.search-bar-widget .filter-wrap .add-filter-btn').click(function(e) {
    e.stopPropagation() // Stop from closing the menu
    $('.search-bar-widget .filter-wrap .filters-menu').toggleClass('active')
})

// Checks for click on menu
$('.search-bar-widget .filter-wrap .filters-menu').click(function(e) {
    e.stopPropagation() // Stop from closing the menu
})


// Checks for adding filter from filter menu
$('.filters-menu .change-filter-state-wrap').click(function() {
    const filterClass = $(this).parent('.filter-option').attr('class').split(" ")[1].replace("option", "filter") // Gets the second class of the element
    const filterName = $(this).siblings('p').text() // Gets the text of the filter
    
    // Checks to see if filter is already active
    if(!$(this).children('.change-filter-state').hasClass('active')) { 
        addFilter(filterClass, filterName) // Adds the filter to active filters
    } else {
        removeFilter(filterClass, filterName) // Removes the filter from active filters
    }
})

$('.search-bar-widget .student-search-input').on('input', function() {
    showStudents()
})

// Checks for click on an active filter close button
$(document).on('click', '.active-filters-widget .active-filters-wrap .filter-wrap .close-filter', function() {
    const filterName = $(this).siblings('.filter-name').text()
    const filterClass = $(this).parent('.filter-wrap').attr('class').split(" ")[1]
    removeFilter(filterClass, filterName) // Removes Filter
})

// Checks for document to load
$(document).ready(function() {
    // Adds students based on student data
    for(let i=0;i<data.students.length;i++) {
        appendStudent(data.students[i]) // Appends student to Student Widget
    }
})

// Check for click on window
$(window).click(function() {
    $('.search-bar-widget .filter-wrap .filters-menu').removeClass('active') // Closes filter menu
})