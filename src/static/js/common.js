const filter = {}
const order = {};

function getContacts(storage, filter, order) {
  var filter = filter || {}
  var order = order || {}
  var contacts = []
  
  for (var id in storage.lk_contacts) {
	  contact = storage.lk_contacts[id];

	  var name = contact.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	  var tagLine = (contact.tagLine || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

	  var text = (filter.text || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	  if (text.length < 3) text = '';

	  var keep = ! (filter.text)

	  if (! filter.isArchived) {
         if (contact.isArchived) continue;
	  }

	  if (filter.starred) {
         if (! contact.starred) continue;
	  }

	  if (text.length > 2) {
         if (name.includes(text)) keep = true;
         if (tagLine.includes(text)) keep = true;
	  }

	  if (filter.followers) {
        var followers = contact.followers || 0;
        if (followers <= filter.followers * 1000) keep = false;
	  }

      var filterDegree = filter.degree;
      if (filterDegree == '0') filterDegree = null;
	  if (filterDegree) {
        var degree = (contact.degree || '4')[0];
        if (degree != filterDegree) keep = false;
	  }

	  if (filter.verified) {
         if (! contact.verified) keep = false;
	  }

	  if (filter.premium) {
         if (! contact.premium) keep = false;
	  }

	  if (filter.topVoice) {
         if (! contact.topVoice) keep = false;
	  }

	  if (filter.company && filter.company.length) {
         if (! contact.currentCompany) {
           keep = false;
         } else if (! filter.company.includes(contact.currentCompany)) {
           keep = false;
	     }
      }

	  if (keep) contacts.push(contact);
  }
  
  var orderKeys = ['followers', 'degree', 'name']
  for (var keyId in orderKeys) {
    var key = orderKeys[keyId];
    if (! (key in order)) continue
    contacts = contacts.sort(function(a, b) {
      var sort = order[key];
      var valA = a[key];
      var valB = b[key];
      if (key == 'followers' && sort == "+") return Math.round(valA || 0) - Math.round(valB || 0)
      if (key == 'followers' && sort == "-") return Math.round(valB || 0) - Math.round(valA || 0)
      if (key == 'degree' && sort == "+") return (valA || '5rd').localeCompare(valB || '5rd')
      if (key == 'degree' && sort == "-") return (valB || '5rd').localeCompare(valA || '5rd')
      if (key == 'name' && sort == "+") return valA.localeCompare(valB)
      if (key == 'name' && sort == "-") return valB.localeCompare(valA)
      return a[key] - a[key];
    });
  }

  return contacts
}

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

function downloadContactCsv(filter, order) {
  browser.storage.local.get().then(function (storage) {
    var contacts = getContacts(storage, filter, order)
    var csvData = "ID;Name;Description;URL;Email;Phone;Mobile phone\n";
    for (var idx in contacts) {
      var contact = contacts[idx];
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

$('#parserEnabled').on('change', function (e) {
  inputTag = $(this);
  isOn = inputTag.prop('checked');
  browser.storage.local.get().then(function (storage) {
    updateConfig(storage, 'parserEnabled', isOn);
    refreshConfig(storage);
  });
});
$('.contactDownloadBtn').on('click', function (e) {
  downloadContactCsv(filter, order);
});
$('.companyDownloadBtn').on('click', function (e) {
  downloadCompanyCsv(filter, order);
});
$(".backupBtn").on("click", function(e) {
  downloadStorage();
});

function setUpParserEnabledCheckbox(storage) {
  parserEnabled = storage.config.parserEnabled;
  $(`#parserEnabled`).prop('checked', parserEnabled);
  updateConfig(storage, 'parserEnabled', parserEnabled)
}

$(function() {
  browser.storage.local.get().then(function (storage) {
    setUpParserEnabledCheckbox(storage);
    $('.contactCount').text(Object.keys(storage.lk_contacts).length);
    $('.companyCount').text(Object.keys(storage.lk_companies).length);
  });

});
