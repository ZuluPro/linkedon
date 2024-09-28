function showContacts(contacts) {
    var table = document.getElementById("contactTable");
    for (var id in contacts) {
      var contact = contacts[id];
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

browser.storage.local.get().then(function (storage) {
	console.log(storage.lk_companies);
	if (document.URL.endsWith('contacts.html')) {
		showContacts(storage.lk_contacts);
	} else if (document.URL.endsWith('companies.html')){
		showCompanies(storage.lk_companies);
	}
})
