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
    var csvData = "ID;Name;Description;URL;Email;Phone;Mobile phone\n";
    for (var id in storage.lk_contacts) {
      var contact = storage.lk_contacts[id];
      var row = `${contact.id};"${contact.name.replace('"' ,'')}";"${(contact.description || '').replace('"' ,'')}";${contact.url};${contact.email || ''};${contact.phone || ''};${contact.phoneMobile || ''}\n`;
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
      var row = `${contact.id},"${contact.name}","${contact.description.replace('"', '') || ''}",${contact.url}\n`;
      csvData = csvData + row;
    }
    var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'companies.csv');
  })
}

function downloadStorage() {
  browser.storage.local.get().then(function (storage) {
	var json = JSON.stringify(storage); 
    var blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, 'live-likedin.json');
  });
}
