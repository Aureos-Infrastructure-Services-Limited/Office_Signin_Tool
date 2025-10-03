
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
  
  const apiUrl = "https://default917b4d06d2e9475983a3e7369ed74e.8f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/68f4b85e912d4688bf1cff4ba198c9e8/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yHu-9RlOVAzjhNKA5r7SFYDneEKz-049xLitmFQX9CU";
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
