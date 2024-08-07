
async function completedInduction(){
  console.log(SPID)
  DisableButton('inductionSubmitButton')
  response = await submitInduction()
  if(response.status == "updated"){
      alert("It has been recorded that you have completed the "+sessionStorage.getItem("officeName")+" induction")
      //window.location.href="/?id="+sessionStorage.getItem("officeID")
      window.history.back()
  }
  }
  function DisableButton(btnId) {
    document.getElementById(btnId).disabled = true;
    }
async function submitInduction(){

  const bodyData = {
      'SPID': sessionStorage.getItem("SPID"),
      'OfficeID':sessionStorage.getItem("officeID")
      };
  
  const headers = {
      'Content-Type':'application/json'
  };
  
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyData)
  };
  
  const apiUrl = "https://prod-20.uksouth.logic.azure.com:443/workflows/68f4b85e912d4688bf1cff4ba198c9e8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YAht3RSExtaTFdHCCoQ3cxfoWtT4hsF8_wh0V0IyJBg";
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
