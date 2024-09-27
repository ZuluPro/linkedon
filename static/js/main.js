function showContacts(contacts) {
    var table = document.getElementById("contactTable");
    for (var id in contacts) {
      var contact = contacts[id];
      var trTag = document.createElement("tr");
      trTag.innerHTML = `
          <th>
            <img src="${contact.img}" height="64">
          </th>
          <th>
            <a href="${contact.url}">${contact.name}</a>
          </th>
          <td>
            ${contact.description}
          </td>
          <td>
            ${contact.id}
          </td>
      `;
      table.children[1].appendChild(trTag);
      // document.getElementById("contactCount").innerHTML = `${contacts.length} contacts`
    }
}
browser.storage.local.get().then(function (storedData) {
    storage = storedData;
    showContacts(storedData.lk_contacts);
})
