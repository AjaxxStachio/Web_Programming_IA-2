/*
File Name:      ticket.js
Student Name:   Ajani Scarlett
Student ID:     2302995
Assignment:     2302995_IA#2_AY26-27
Due Date:       26/10/2026
*/

document.addEventListener("DOMContentLoaded", () => {
    
    // Here putds the user information in local storage 
    const userDataString = localStorage.getItem("codingConfUser");
    
    if (userDataString) {
        const userData = JSON.parse(userDataString);
  
        document.getElementById("userName").textContent = userData.fullName.split(' ')[0];
        document.getElementById("userEmail").textContent = userData.email;
        document.getElementById("userEmail").href = `mailto:${userData.email}`;
        document.getElementById("ticketName").textContent = userData.fullName;
        document.getElementById("githubText").textContent = userData.github;
        document.getElementById("userAvatar").src = userData.avatarData;
 
        const githubLink = document.getElementById("ticketGithub");
        const githubUsername = userData.github.replace("@", "");
        githubLink.href = `https://github.com/${githubUsername}`;
       
        const randomSerial = Math.floor(10000 + Math.random() * 90000); 
        document.getElementById("ticketNumber").textContent = `#${randomSerial}`;
    }

   // This section controls the date 

    const dateElement = document.getElementById("ticketDate");
    
    if (!dateElement) return;

    // Here displays the date in a format of month, day and year in numeric values 
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let locationString = "Austin, TX"; 

    // This function updates the text on the ticket
    function updateTicketDate() { 
        dateElement.innerHTML = `${formattedDate} &nbsp;/&nbsp; <span id="locText">${locationString}</span>`;
    }

    // If the local host fails to retrieve the location from the users device, it will use the default address 
    updateTicketDate();

    // This attempts to find the geoloaction of the user's local host to display the in-time data 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                //The fetch uses a geotrack API that fetch the real time geolocation of the local machine of the user 
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        //  This portion extracts the city, town, or village
                        const city = data.address.city || data.address.town || data.address.village || data.address.county || "Local Area";
                        
                        //  this extracts the country code and make it uppercase
                        const countryCode = data.address.country_code ? data.address.country_code.toUpperCase() : "";
                        
                        //  Combine them cleanly
                        const newLocation = countryCode ? `${city}, ${countryCode}` : city;
                        
                        // 4. after some time will update the user UI to display the fetched data
                        const locSpan = document.getElementById("locText");
                        if (locSpan) {
                            locSpan.textContent = newLocation;
                        }
                    })
                    .catch(() => {
                        //Dispolays the default text in the event that the geolocation fails to fetch the local host's geolocation
                        const locSpan = document.getElementById("locText");
                        if (locSpan) {
                            locSpan.textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
                        }
                    });
            },
            (error) => {
                // If the user denies to 
                console.warn("Location access denied or unavailable. Using default.");
            }
        );
    }
});