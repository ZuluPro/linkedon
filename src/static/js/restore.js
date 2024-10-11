const inputElement = document.getElementById("restoreInput");
inputElement.addEventListener("change", handlePicked, false);

function handlePicked() {
  const inputElement = document.getElementById("restoreInput");
  inputElement.addEventListener("change", handlePicked, false);

  var file = this.files[0]
  var reader = new FileReader();
  reader.onload = function(event) {
      try {
        browser.storage.local.get().then(function (storage) {
          var jsonData = JSON.parse(event.target.result);  
          browser.storage.local.set(jsonData)
        });
        inputElement.value = "";
      } catch (error) {
          // 
      }
  }; 
  reader.readAsText(file);
  
}
