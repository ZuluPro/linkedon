let defaultStorage = {
  lk_contacts: {},
};

function onError(e) {
  console.error(e);
}

function checkStoredSettings(storedSettings) {
  if (!storedSettings.lk_contacts) {
      browser.storage.local.set(defaultStorage);
      storage = storedSettings;
  }
}

browser.storage.local.get().then(checkStoredSettings, onError);
browser.storage.local.get().then(function (storedData) {
    storage = storedData;
})

function parsePeople() {
    var contacts_tags = document.getElementsByClassName('update-components-actor__container');
    for (let i = contacts_tags.length-1; i > -1; i--) {
        var contact = contacts_tags[i];
        var href = $(contact).find('a.app-aware-link')[0].href;
        if (! href.startsWith("https://www.linkedin.com/in/")) {
            continue
        }
        var url = href.split('?')[0];
        var id = url.split('/in/')[1];
        if (! (id in storage['lk_contacts'])) {
            storage['lk_contacts'][id] = {
                'id': id,
                "url": url,
            };
            console.log('Added ' + id);
        }
        var name = $(contact).find('.update-components-actor__name span span')[0].textContent
        var image_url = $(contact).find('img')[0].src;
        var degree = $(contact).find('.update-components-actor__supplementary-actor-info')[0].textContent.replace(" • ", ""); 
        var desc = $(contact).find('.update-components-actor__description')[0].children[0].textContent.trim();
        var new_details = {
            'id': id,
            "name": name,
            "url": url,
            'img': image_url,
            // "degree": degree,
            "description": desc,
        };
        storage['lk_contacts'][id] = new_details
    }
    browser.storage.local.set(storage);
}

addEventListener("scrollend", (event) => {
    parsePeople()
});
