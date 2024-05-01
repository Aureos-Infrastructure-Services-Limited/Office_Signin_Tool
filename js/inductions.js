
async function completedInduction(){
  console.log(SPID)
  response = await submitInduction()
  if(response.status == "updated"){
      alert("It has been recorded that you have completed the "+officeName+" induction")
      window.location.href="index.html?id="+officeID
  }
  }

async function submitInduction(){

  const bodyData = {
      'SPID': sessionStorage.getItem("SPID")
      };
  
  const headers = {
      'Content-Type':'application/json'
  };
  
  const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(bodyData)
  };
  
  const apiUrl = "https://prod-20.uksouth.logic.azure.com:443/workflows/c1a73c2f6ad24753a29baf12f15cfec4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=050VUuF2YdPEOV2wVV7gK4JSrybKfm1dHBvQiwGQfGA";
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
