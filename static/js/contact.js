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
  
  var orderKeys = ['followers', 'degree', 'name']
  for (var keyId in orderKeys) {
    var key = orderKeys[keyId];
      console.log(key, order)
      console.log(key in order)
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
	  if (contact.website) {
        var websiteText = contact.website.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.website}"><i class="bi bi-link-45deg"></i> ${websiteText}</a> `
	  }
	  if (contact.blog) {
        var websiteText = contact.blog.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.blog}"><i class="bi bi-link-45deg"></i> ${websiteText}</a> `
	  }
	  if (contact.companyWebsite) {
        var websiteText = contact.companyWebsite.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.CompanyWebsite}"><i class="bi bi-link-45deg"></i> ${websiteText}</a> `
	  }
	  if (contact.email) {
	    trContent += `<a class="badge text-bg-primary" href="mailto:${contact.email}"><i class="bi bi-envelope"></i> ${contact.email}</a> `
	  }
	  if (contact.phoneMobile) {
	    trContent += `<a class="badge text-bg-primary" href="tel:${contact.phoneMobile}"><i class="bi bi-phone"></i> ${contact.phoneMobile}</a> `
	  }
	  if (contact.phone) {
	    trContent += `<a class="badge text-bg-primary" href="tel:${contact.phone}"><i class="bi bi-telephone"></i> ${contact.phone}</a> `
	  }
	  if (contact.icq) {
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.icq}"><i class="bi bi-chat"></i> ${contact.icq}</a> `
	  }
	  if (contact.twitter) {
        var websiteText = contact.twitter.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.twitter}"><i class="bi bi-twitter"></i> ${websiteText}</a> `
	  }
	  if (contact.skype) {
	    trContent += `<a class="badge text-bg-primary" href="skype:${contact.skype}"><i class="bi bi-skype"></i> ${contact.skype}</a> `
	  }
	  if (contact.github) {
        var websiteText = contact.github.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.github}"><i class="bi bi-github"></i> ${websiteText}</a> `
	  }
	  if (contact.kaggle) {
        var websiteText = contact.kaggle.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.kaggle}"><i class="bi bi-kaggle"></i> ${websiteText}</a> `
	  }
	  if (contact.huggingface) {
        var websiteText = contact.huggingface.split('//')[1];
	    trContent += `<a class="badge text-bg-primary" target="_blank" href="${contact.huggingface}"><i class="bi bi-huggingface"></i> ${websiteText}</a> `
	  }
      trContent += '</td>';

	  // ID
      trContent += '<td>';
      trContent += `<span class="badge text-bg-primary text-break"><i class="bi bi-linkedin"> ${contact.id}</span>`;
	  // trContent += `${(contact.aliases || []).join(" ")}`;
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
  if (filter.text) {
    var inputText = $('#navForm [name="text"]');
    newUrl += `text=${inputText.val()}&`
  }

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
	var contacts = getContacts(storage, filter, order);
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
const order = {};

// Display triggers
$('#navForm input').on('keyup', function (e) {
  updateContacts();
});
$('#navForm input[type="checkbox"]').on('change', function (e) {
  updateContacts();
});

// Order
$('.tableSorter').on('click', function (e) {
    var key = this.dataset.field;
    var value = this.dataset.order;
    if (value == '+') {
      value = '-';
    } else if (value == '-') {
      value = '+';
    } else {
      value = '+';
    }
    order[key] = value;
    this.dataset.order = value;
    updateContacts();
});

// Display at startup
updateContacts();
