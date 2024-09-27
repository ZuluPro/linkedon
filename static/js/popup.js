document.getElementById("contactBtn").addEventListener("click", () => {
  browser.tabs.create({ url: 'home.html' });
});



function downloadContactCsv() {
browser.storage.local.get().then(function (storage) {
  // Prepare the CSV data
  var data = storage['lk_contacts'];
  var csvData = "ID,Name,Description,URL\n";
  for (var id in data) {
    var contact = storage['lk_contacts'][id];
    var row = `${contact.id},"${contact.name}","${contact.description || ''}",${contact.url}\n`;
    csvData = csvData + row;
  }
  // Create a Blob object
  var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');

  a.href = url;
  a.download = 'contacts.csv';
  // Trigger a click event on the link
  a.click();
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
})
}

document.getElementById("contactDownloadBtn").addEventListener("click", () => {
	downloadContactCsv();
});
