function showContacts(contacts, storage) {
    var table = document.getElementById("contactTable");
    for (var id in contacts) {
      var contact = contacts[id];
      contact.currentCompanyLogo = getCompanyLogo(contact.currentCompany, storage);

      var trTag = document.createElement("tr");
      trTag.id = id;
      trTag.innerHTML = `
          <th>
			<a href="${contact.url}" target="_blank">
              <img src="${contact.img}" height="64">
			</a>
          </th>
          <th>
            <a href="${contact.url}" target="_blank">
			  ${contact.name}
			</a>
          </th>
          <td>
            ${contact.degree || ""}
          </td>
          <td>
            ${contact.tagLine || contact.description || ""}
          </td>
	  `
	  if (contact.currentCompany) {
	    trTag.innerHTML = trTag.innerHTML + `
            <td>
			  <a href="https://www.linkedin.com/company/${contact.currentCompany}" target="_blank">
                <img src="${contact.currentCompanyLogo}" height="64" alt="${contact.currentCompany || ""}">
			  </a>
            </td>
	    `
	  } else {
	    trTag.innerHTML = trTag.innerHTML + '<td></td>'
	  }
	  trTag.innerHTML = trTag.innerHTML + `
          <td>
            ${contact.followers || ""}
          </td>
          <td>
            ${contact.id}
            ${(contact.aliases || []).join(" ")}
          </td>
      `;
      table.children[1].appendChild(trTag);
      // document.getElementById("contactCount").innerHTML = `${contacts.length} contacts`
    }
}
function showCompanies(companies) {
    var table = document.getElementById("companiesTable");
    for (var id in companies) {
      var company = companies[id];
      var trTag = document.createElement("tr");
      trTag.id = id;
      trTag.innerHTML = `
          <th>
			<a href="${company.url}" target="_blank">
              <img src="${company.img}" height="64">
			</a>
          </th>
          <th>
            <a href="${company.url}" target="_blank">
			  ${company.name}
			</a>
          </th>
          <td>
            ${company.tagLine || ""}
          </td>
          <td>
            ${company.employees || ""}
          </td>
          <td>
            ${company.followers || ""}
          </td>
          <td>
            ${company.id}
          </td>
          <td>
            <a href="${company.companyUrl}">Site</a>
          </td>
      `;
      table.children[1].appendChild(trTag);
      // document.getElementById("companyCount").innerHTML = `${companies.length} companies`
    }
}
function getCompanyLogo(id, storage) {
  var company = storage.lk_companies[id]
  if (!company) return ''
  return company.img;
}

function deleteContact(id) {
  browser.storage.local.get().then(function (storage) {
	delete storage.lk_contacts[id];
  });
}

browser.storage.local.get().then(function (storage) {
	console.log(storage.lk_companies);
	if (document.URL.endsWith('contacts.html')) {
		showContacts(storage.lk_contacts, storage);
	} else if (document.URL.endsWith('companies.html')){
		showCompanies(storage.lk_companies, storage);
	}
})
