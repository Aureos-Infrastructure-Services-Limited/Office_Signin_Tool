document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
    checkURL()
    populateFromStorage()
    
})

async function populateFromStorage(){
    inputEmail = document.getElementById("Email")
    inputFirstName = document.getElementById("firstName")
    inputLastName = document.getElementById("lastName")
    inputPhone = document.getElementById("Phone")
    inputVehicleReg = document.getElementById("VehicleReg")

    localEmail = localStorage.getItem("localEmail");
    localPhone = localStorage.getItem("localPhone");
    localFirstName = localStorage.getItem("localFirstName");
    localLastName = localStorage.getItem("localLastName");
    localVehicleReg = localStorage.getItem("localVehicleReg");

    inputEmail.value = localEmail
    console.log("Email:",localEmail)

    inputFirstName.value = localFirstName
    console.log("First Name:",localFirstName)

    inputLastName.value = localLastName
    console.log("Last Name:",localLastName)

    inputPhone.value = localPhone
    console.log("Phone:",localPhone)

    inputVehicleReg.value = localVehicleReg
    console.log("Vehicle Reg:",localVehicleReg)
}

async function submitRequest(){
    DisableButton('submit_btn')
    localEmail = localStorage.getItem("localEmail");
    localPhone = localStorage.getItem("localPhone");
    localFirstName = localStorage.getItem("localFirstName");
    localLastName = localStorage.getItem("localLastName");
    localVehicleReg = localStorage.getItem("localVehicleReg");

    localFirstName = $("#firstName").val(),
    localLastName = $("#lastName").val(),
    localEmail = $("#Email").val(),
    localPhone = $("#Phone").val(),
    localVehicleReg = $("#VehicleReg").val()
    console.log("Reg:",localVehicleReg)

    result = await submitSign()

    // If device is not remembered, prompt user to remember it
    if (!localEmail || !localFirstName || !localLastName || !localPhone || !localVehicleReg) {
        var remember = confirm("Do you want to remember your details for future sign ins?");
        if (remember) {
            localStorage.setItem("localFirstName", localFirstName);
            localStorage.setItem("localLastName", localLastName);
            localStorage.setItem("localEmail", localEmail);
            localStorage.setItem("localPhone", localPhone);
            //localStorage.setItem("localVehicleReg", localVehicleReg);
        }
    }
   // If device is not remembered, prompt user to remember it
   if (localEmail != localStorage.getItem("localEmail")|| 
   localFirstName != localStorage.getItem("localFirstName")|| 
   localLastName != localStorage.getItem("localLastName")|| 
   localPhone != localStorage.getItem("localPhone")) {
        var remember = confirm("Do you want to update your details?");
        if (remember) {
            localStorage.setItem("localFirstName", localFirstName);
            localStorage.setItem("localLastName", localLastName);
            localStorage.setItem("localEmail", localEmail);
            localStorage.setItem("localPhone", localPhone);
            localStorage.setItem("localVehicleReg", localVehicleReg);
        }
    }
    localStorage.setItem("localVehicleReg", localVehicleReg);
    sessionStorage.setItem("SPID",result.SharePointID)
    
    if(result.signType == "Signed In"){
        //document.getElementById("inputForm").reset();

        
        if(result.inductionComplete == false){
            alert("You have successfully "+result.signType+" at "+result.time+", however you have not completed the office induction, please complete the following induction "+officeName)
            switch(officeID) {
                case "ANDOVER":
                  // code block
                  window.location.href="ANDOVER_Induction.html"
                  break;
                case "NOTS":
                  // code block
                  window.location.href="NOTS_Induction.html"
                  break;
                default:
                  // code block
              }
        }else{
            alert("You have successfully "+result.signType+" at "+result.time+" and you have already completed the office induction for "+officeName)
        }
        
    }else{
        alert("You have successfully "+result.signType+" at "+result.time)
    }
    EnableButton('submit_btn')
}

   
async function submitSign(){

        const bodyData = {
            "office": sessionStorage.getItem("officeID"),
            "firstName": $("#firstName").val(),
            "lastName": $("#lastName").val(),
            "email": $("#Email").val(),
            "phone": $("#Phone").val(),
            "vehicleReg": $("#VehicleReg").val(),
            "distanceTravelled": $("#DistanceTravelled").val(),
            "company": $("#company").val(),
            "toSee": $("#toSee").val()
            };
        
        const headers = {
            'Content-Type':'application/json'
        };
        
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData)
        };
        
        const apiUrl = "https://default917b4d06d2e9475983a3e7369ed74e.8f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/04a0b5e53b11460aa9a91ccfd2c44c6a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QaBs46MJr07vEtjsK0jQrR_veArdK4_AcclqdWhrt-c";
        console.log(apiUrl)
        console.log(requestOptions)
        data = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                const JSONdata = data
        
            console.log(JSONdata)
        
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
            
        return data
    }


function checkURL(){
        // Get the query string portion of the URL
        var queryString = window.location.search;

        // Check if the query string contains an 'id' parameter
        if (queryString.includes('id=')) {
            console.log('The URL contains an Project ID parameter');
            getProjectFromURL()
        } else {
            console.log('The URL does not contain an Project ID parameter');
            alert("No project code detected please check link provided has a Project code in the URL")
            showPopup()
        }
    }

async function getProjectFromURL(){
        // Get the URL of the current page
        var url = window.location.href;
        var header = document.getElementById('locationName')

        // Check if the URL contains a parameter named 'id'
        if (url.indexOf('id=') !== -1 || sessionStorage.getItem('officeID') != null) {
            // Extract the value of the 'id' parameter
            var id = url.split('id=')[1];
            await getOfficeList()
            office = officeList.filter(item => item.Office_Code == id)
            officeName = office[0].Office_Name
            // Display the extracted ID
            officeID = id
            
            console.log('Selected OfficeID:', officeID);
            console.log('Office Name:', officeName);
            sessionStorage.setItem("officeID",officeID)
            sessionStorage.setItem("officeName",officeName)
            header.innerHTML = `<h2>${officeName} </h2>`
        } else {
            console.log('No ID parameter found in the URL');

        }
    }

 async function getOfficeList(){
   
    const headers = {
        'Content-Type':'application/json'
    };
    
    const requestOptions = {
        method: 'GET',
        headers: headers,
        };
    
    const apiUrl = "https://default917b4d06d2e9475983a3e7369ed74e.8f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2844aa86f91c432883ee87b37e0f7e9f/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ppQyVSq_tnqaDE8M9p2xX7x0fXCetALG9dezO8XVBlU";
    //console.log(apiUrl)
    //console.log(requestOptions)
    data = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
    
        console.log(JSONdata)
        officeList = JSONdata
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
        
    return data
    }

function DisableButton(btnId) {
    document.getElementById(btnId).disabled = true;
    }

function EnableButton(btnId) {
    document.getElementById(btnId).disabled = false;
    }

// Function to show popup
async function showPopup() {
    const popup = document.getElementById('popup');
    const officeList = document.getElementById('officeList');
    
    // Example list of offices
    const offices = await getOfficeList();

    // Generate list items
    offices.forEach((office, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.textContent = office.Office_Name;
        div.onclick = function() {
            setOfficeID(office.Office_Code,office.Office_Name);
        };
        officeList.appendChild(div);
    });

    popup.style.display = 'block';
}

// Function to close popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

function setOfficeID(officeID,officeName) {
    // Your logic to set the OfficeID variable
    var header = document.getElementById('locationName')
    console.log('Selected OfficeID:', officeID);
    console.log('Office Name:', officeName);
    sessionStorage.setItem("officeID",officeID)
    sessionStorage.setItem("officeName",officeName)
    header.innerHTML = `<h2>${officeName} </h2>`
    closePopup();
}