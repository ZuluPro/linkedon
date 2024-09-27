let defaultStorage = {
  lk_contacts: {},
  lk_companies: {},
};

function onError(e) {
  console.error(e);
}

function checkStoredSettings(storage) {
  if (!storage.lk_contacts) {
	  storage.lk_contacts = {};
	  storage.lk_contact_aliases = {};
  }
  if (!storage.lk_companies) {
	  storage.lk_companies = {};
	  storage.lk_company_aliases = {};
  }
  browser.storage.local.set(storage);
  storage = storage;
}

browser.storage.local.get().then(checkStoredSettings, onError);
browser.storage.local.get().then(function (storedData) {
    storage = storedData;
})

function parseFeed() {
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

function parsePerson() {
    var id = document.URL.slice(28).replace('/', '');
    browser.storage.local.get().then(function (storage) {
		var contact = storage['lk_contacts'][id];
		var longName = $('h1').text().trim();
		if (! contact) {
			contact = {id: id, name: longName};
		}
		contact.url = document.URL;
		contact.longName = longName;
		contact.verified = Boolean($('[href="#verified-medium"]').length);
		contact.img = $('img.pv-top-card-profile-picture__image--show')[0].src;
		contact.description = $('.text-body-medium').text().trim();

		$('span.t-bold').each(function (t) {
			var text = this.parentElement.textContent.trim();
			if (text.includes('followers')) {
				contact.followers = text.split(' ')[0].replace(',', '');
			}
		});
		$('.distance-badge span.visually-hidden').each(function (t) {
			var text = this.parentElement.textContent.trim();
			if (text.includes('degree connection')) {
				contact.degree = text.split(' ')[0];
			}
		});
		if (! contact.name) {
			contact.name = contact.longName
		}
		storage['lk_contacts'][id] = contact;
		browser.storage.local.set(storage);

		var currentCompanyName = $('button[aria-label^="Current company: "]')[0].textContent.trim()
		$('a[data-field="experience_company_logo"].optional-action-target-wrapper').each(function(i) {
			var companyTag = this;
			if (! companyTag.href.startsWith('https://www.linkedin.com/company/')) {
				return
			}
			var companyUrl = companyTag.href;
			var companyId = companyUrl.slice(33).replace('/', '');
			var company = {};
			if (! (companyId in storage.lk_companies)) {
				company = {id: companyId, url: companyUrl};
			} else {
				company = storage.lk_companies[companyId];
			}
			company = {
				id: companyId,
				url: companyUrl,
			};
			imgTag = $(companyTag).find('img')[0];
			if (imgTag) company.img = imgTag.src;
			if ($(companyTag).parent().parent().text().trim().includes(currentCompanyName)) company.name = currentCompanyName;

			storage.lk_companies[companyId] = company;
			browser.storage.local.set(storage);
		});
	})
}

function parseSocialReactor() {
    debugger
    var contact_href = document.URL.slice(28).replace('/', '');
}

addEventListener("scrollend", (event) => {
    if (document.URL == "https://www.linkedin.com/feed/") {
        parseFeed()
    }
    if (document.URL.startsWith('https://www.linkedin.com/in/')) {
        parsePerson()
    }
    if (document.URL.startsWith('https://www.linkedin.com/feed/update/urn:li:activity:')) {
        parseSocialReactor()
    }
});
