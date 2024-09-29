function getContacts(storage, filter) {
  var filter = filter || {}
  var contacts = []
  
  for (var id in storage.lk_contacts) {
	  contact = storage.lk_contacts[id];

	  var name = contact.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	  var tagLine = (contact.tagLine || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

	  var text = (filter.text || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	  if (text.length < 3) text = '';

	  var keep = ! (filter.text)

	  if (filter.text.length > 2) {
         if (name.includes(text)) keep = true;
         if (tagLine.includes(text)) keep = true;
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

	  if (keep) contacts.push(contact);
  }
  return contacts
}

function showContacts(contacts, storage) {
    var table = document.getElementById("contactTable");
    $('#contactTable tbody').empty();
    for (var id in contacts) {
      var contact = contacts[id];
      contact.currentCompanyLogo = getCompanyLogo(contact.currentCompany, storage);

      var trTag = document.createElement("tr");
      trTag.id = id;
	  // ID
      trContent = ''
      trContent = `
          <th>
			<a href="${contact.url}" target="_blank">
              <img src="${contact.img}" height="64">
			</a>
          </th>
	  `
	  // Name
      trContent += '<th>'
      trContent += `<p class="mb-1"><a href="${contact.url}" target="_blank">${contact.name}</a></p>`
	  if (contact.topVoice) {
        trContent += `<span class="badge text-bg-warning"><i class="bi bi-megaphone"></i></span>`
	  }
	  if (contact.premium) {
        trContent += `<span class="badge text-bg-warning"><i class="bi bi-linkedin"></i></span>`
	  }
	  if (contact.verified) {
        trContent += '<span class="badge text-bg-secondary"><i class="bi bi-shield-check"></i></span>'
	  }
      trContent += '</th>'
	  // Degree
      trContent += '<td>'
      trContent += `${contact.degree || ""}`
	  if (contact.connectedSince) {
        trContent += '<br>'
        trContent += `<small>${contact.connectedSince.toISOString().slice(0, 10)}</small>`
	  }
      trContent += '</td>'
	  // TagLine
	  var tagLine = contact.tagLine || contact.description || "";
	  if (tagLine.length > 300) tagLine = tagLine.slice(0, 300) + "..."
      trContent += `<td>${tagLine}</td>`
	  // Company
      trContent += '<td>';
	  if (contact.currentCompany) {
	    trContent += `
			  <a href="https://www.linkedin.com/company/${contact.currentCompany}" target="_blank">
                <img src="${contact.currentCompanyLogo}" height="64" alt="${contact.currentCompany || ""}">
			  </a>
	    `;
	  }
      trContent += '</td>';

      // Followers
	  trContent += `<td>${contact.followers || ""}</td>`;

	  // Contact
      trContent += '<td>';
	  if (contact.email) {
	    trContent += `<a class="badge text-bg-primary" href="mailto:${contact.email}">${contact.email}</a>`
	  }
	  if (contact.phoneMobile) {
	    trContent += `<a class="badge text-bg-primary" href="tel:${contact.phoneMobile}">Mobile: ${contact.phoneMobile}</a>`
	  }
	  if (contact.phone) {
	    trContent += `<a class="badge text-bg-primary" href="tel:${contact.phone}">${contact.phone}</a>`
	  }
      trContent += '</td>';

	  // ID
      trContent += '<td>';
      trContent += `ID:${contact.id}`;
	  trContent += `${(contact.aliases || []).join(" ")}`;
      trContent += '</td>';
	  trTag.innerHTML = trContent
			// <button onclick="deleteContact(${contact.id})">x</button>

      table.children[1].appendChild(trTag);
      // document.getElementById("contactCount").innerHTML = `${contacts.length} contacts`
    }
}
function deleteContact(id) {
  browser.storage.local.get().then(function (storage) {
	delete storage.lk_contacts[id];
  });
}

function updateContacts() {
  // Filter from URL
  var url = new URL(document.URL);
  var newUrl = document.URL.split('?')[0] + "?";

  filter.text = $('#navForm [name="text"]').val();
  var checkboxKeys = ['premium', 'verified', 'topVoice']
  for (var i in checkboxKeys) {
	var key = checkboxKeys[i];
    var checkbox = $(`#navForm [name="${key}"]`);
    // Then filter form form
    filter[key] = checkbox.is(':checked');
    // Update URL & inputs
    checkbox.prop('checked', filter[key]);
    if (filter[key]) {
      newUrl += `${key}=on&`
    }
  }
  window.history.pushState(newUrl, "Contacts", newUrl)
  // Do the job
  browser.storage.local.get().then(function (storage) {
	var contacts = getContacts(storage, filter);
	showContacts(contacts, storage);
  })
}

// Set form values
var url = new URL(document.URL);
const filter = {
  text: url.searchParams.get('text'),
};
var checkboxKeys = ['premium', 'verified', 'topVoice']
for (var i in checkboxKeys) {
  var key = checkboxKeys[i];
  if (Boolean(url.searchParams.get(key))) {
	$(`#navForm [name="${key}"]`).prop('checked', true);
	filter[key] = true;
  }
}
//
// Display triggers
$('#navForm input').on('keyup', function (e) {
  updateContacts();
});
$('#navForm input[type="checkbox"]').on('change', function (e) {
  updateContacts();
});

// Display at startup
updateContacts();
