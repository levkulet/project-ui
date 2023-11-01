$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});

function toggleSubMenu(event) {
    event.preventDefault(); // Prevent the default link behavior
    const submenu = document.getElementById("homeSubmenu");
    $(submenu).collapse('toggle'); // Toggle the collapse logoe of the submenu
}

 // Function to toggle logos based on screen size
    function toggleLogos() {
        if (window.innerWidth <= 768) { // Change the screen width breakpoint as needed
            document.getElementById('logo-large').style.display = 'none';
            document.getElementById('logo-small').style.display = 'block';
        } else {
            document.getElementById('logo-large').style.display = 'block';
            document.getElementById('logo-small').style.display = 'none';
        }
    }

    // Call the function on page load and when the window is resized
    toggleLogos();
    window.addEventListener('resize', toggleLogos);

//Funtion for text to icons
function toggleTextAndIcons() {
    if (window.innerWidth <= 768) { // Adjust the screen width breakpoint as needed
        document.querySelectorAll('.large-screen-text').forEach(function (text) {
            text.style.display = 'none';
        });
        document.querySelectorAll('.small-screen-icon').forEach(function (icon) {
            icon.style.display = 'inline';
        });
    } else {
        document.querySelectorAll('.large-screen-text').forEach(function (text) {
            text.style.display = 'inline';
        });
        document.querySelectorAll('.small-screen-icon').forEach(function (icon) {
            icon.style.display = 'none';
        });
    }
}

toggleTextAndIcons();
window.addEventListener('resize', toggleTextAndIcons);