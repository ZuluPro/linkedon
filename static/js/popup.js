function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    // Trigger a click event on the link
    a.click();
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function downloadContactCsv() {
  browser.storage.local.get().then(function (storage) {
    var csvData = "ID,Name,Description,URL\n";
    for (var id in storage.lk_contacts) {
      var contact = storage.lk_contacts[id];
      var row = `${contact.id},"${contact.name}","${contact.description || ''}",${contact.url}\n`;
      csvData = csvData + row;
    }
    var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'contacts.csv');
  })
}
function downloadCompanyCsv() {
  browser.storage.local.get().then(function (storage) {
    var csvData = "ID,Name,Description,URL\n";
    for (var id in storage.lk_companies) {
      var contact = storage.lk_companies[id];
      var row = `${contact.id},"${contact.name}","${contact.description || ''}",${contact.url}\n`;
      csvData = csvData + row;
    }
    var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'companies.csv');
  })
}

// document.getElementById("homeBtn").addEventListener("click", () => {
//   browser.tabs.create({url: '/html/home.html' });
// });
document.getElementById("contactBtn").addEventListener("click", () => {
  browser.tabs.create({url: '/html/contacts.html' });
});
document.getElementById("companyBtn").addEventListener("click", () => {
  browser.tabs.create({url: '/html/companies.html' });
});

document.getElementById("contactDownloadBtn").addEventListener("click", () => {
	downloadContactCsv();
});
document.getElementById("companyDownloadBtn").addEventListener("click", () => {
	downloadCompanyCsv();
});
