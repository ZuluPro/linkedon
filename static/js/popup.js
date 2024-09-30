$(function() {
  var contactTag = $('#contactItem');
  browser.storage.local.get().then(function (storage) {
	var contactTag = $('#contactItem');
	var content = '';
	content += '<p class="my-1 handHover">';
	content += '<span id="contactBtn">';
	content += `${Object.keys(storage.lk_contacts).length} contacts`;
	content += '</span>';
	content += ' - ';
	content += '<i class="bi bi-download contactDownloadBtn handHover"></i>'
	content += '</p>';
	contactTag.html(content);

    document.getElementById("contactBtn").addEventListener("click", () => {
      browser.tabs.create({url: '/html/contacts.html' });
    });
    $('.contactDownloadBtn').on('click', function (e) {
      downloadContactCsv();
    });

	var companyTag = $('#companyItem');
	var content = '';
	content += '<p class="my-1">';
	content += '<span id="companyBtn">';
	content += `${Object.keys(storage.lk_companies).length} companies`;
	content += '</span>';
	content += ' - ';
	content += '<i class="bi bi-download companyDownloadBtn"></i>'
	content += '</p>';
	companyTag.html(content);

    document.getElementById("companyBtn").addEventListener("click", () => {
      browser.tabs.create({url: '/html/companies.html' });
    });
    $('.companyDownloadBtn').on('click', function (e) {
      downloadCompanyCsv();
    });

	setUpParserEnabledCheckbox(storage);

  });

  document.getElementById("configBtn").addEventListener("click", () => {
    browser.tabs.create({url: '/html/config.html' });
  });
});
