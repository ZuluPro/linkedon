// document.getElementById("homeBtn").addEventListener("click", () => {
//   browser.tabs.create({url: '/html/home.html' });
// });

document.getElementById("backupBtn").addEventListener("click", () => {
  downloadStorage();
});

$('#parserEnabled').on('change', function (e) {
  inputTag = $(this);
  isOn = inputTag.prop('checked');
  browser.storage.local.get().then(function (storage) {
    updateConfig(storage, 'parserEnabled', isOn);
    refreshConfig(storage);
  });
});

$(function() {
  var contactTag = $('#contactItem');
  browser.storage.local.get().then(function (storage) {
	var contactTag = $('#contactItem');
	var content = '';
	content += '<p class="my-1">';
	content += '<span id="contactBtn">';
	content += `${Object.keys(storage.lk_contacts).length} contacts`;
	content += '</span>';
	content += ' - ';
	content += '<i id="contactDownloadBtn" class="bi bi-download"></i>'
	content += '</p>';
	contactTag.html(content);

    document.getElementById("contactBtn").addEventListener("click", () => {
      browser.tabs.create({url: '/html/contacts.html' });
    });
    document.getElementById("contactDownloadBtn").addEventListener("click", () => {
    	downloadContactCsv();
    });

	var companyTag = $('#companyItem');
	var content = '';
	content += '<p class="my-1">';
	content += '<span id="companyBtn">';
	content += `${Object.keys(storage.lk_companies).length} companies`;
	content += '</span>';
	content += ' - ';
	content += '<i id="companyDownloadBtn" class="bi bi-download"></i>'
	content += '</p>';
	companyTag.html(content);

    document.getElementById("companyBtn").addEventListener("click", () => {
      browser.tabs.create({url: '/html/companies.html' });
    });
    document.getElementById("companyDownloadBtn").addEventListener("click", () => {
    	downloadCompanyCsv();
    });

	parserEnabled = storage.config.parserEnabled;
  	$(`#parserEnabled`).prop('checked', parserEnabled);
    updateConfig(storage, 'parserEnabled', parserEnabled)
  });
});
