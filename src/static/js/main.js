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

// Display at startup
browser.storage.local.get().then(function (storage) {
	var url = document.URL.split('?')[0]
	if (url.endsWith('companies.html')){
		showCompanies(storage.lk_companies, storage);
	}
})

// Function to handle window scrolling and update the sticky header class
function handleScroll() {
    const tableHeader = document.querySelector('.table thead');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

	var newOffset = Math.round(navbarHeight + window.scrollY - 100);

	tableHeader.style.setProperty('top', `${newOffset}px`)
    // if (tableHeader.getBoundingClientRect().top < window.screen.height ) {
    if (window.scrollY > 300) {
        tableHeader.classList.add('sticky-header');
    } else {
        tableHeader.classList.remove('sticky-header');
		tableHeader.style.removeProperty('top');
    }
}

// Add event listener for window scrolling
window.addEventListener('scroll', handleScroll);
