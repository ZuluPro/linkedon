function onError(e) {
  console.error(e);
}

function checkStoredSettings(storage) {
  var default_keys = [
    "lk_contacts",
    "lk_contact_aliases",
    "lk_tmp_contact_aliases",
    "lk_companies",
    "lk_company_aliases",
    "lk_tmp_company_aliases",
  ];
  default_keys.map(function(key) {
      if (!storage[key]) {
          console.log("Created table " + key)
          storage[key] = {};
      }
  })
  browser.storage.local.set(storage);
}

browser.storage.local.get().then(checkStoredSettings, onError);


function cleanContactAliases() {
  browser.storage.local.get().then(function(storage) {
    console.log(`Solving ${storage.lk_tmp_contact_aliases.length} alias(es)`);
    for (var id in storage.lk_tmp_contact_aliases) {
      var alias = storage.lk_tmp_contact_aliases[id]
      var contact = null;
      // Solve by name
      if ('name' in alias) {
        for (var contactId in storage.lk_contacts) {
          tmpContact = storage.lk_contacts[contactId];
          if (tmpContact.name == alias.name) {
              contact = tmpContact;
              break
          }
        }
      }
      if (contact == null) {
        console.log(`Cannot solve alias ${alias.id} (${alias.name})`);
        continue 
      }

      if (!contact.tagLine && alias.tagLine) contact.tagLine = alias.tagLine
      if (!contact.degree && alias.degree) contact.degree = alias.degree
      if (!contact.aliases) contact.aliases = [];
      if (!contact.aliases.includes(id)) contact.aliases.push(id);

      storage.lk_contacts[contact.id] = contact;
      storage.lk_contact_aliases[id] = contact.id;
      delete storage.lk_tmp_contact_aliases[id];

	  browser.storage.local.set(storage);
    }
  });
}

function parseFeed() {
    var contactsTags = $('.update-components-actor__container');
	browser.storage.local.get().then(function (storage) {
      for (let i = contactsTags.length-1; i > -1; i--) {
        var contactEle = contactsTags[i];
        contactEle.id = i;
		var contactTag = $(`#${contactEle.id}`);
		  console.log(contactTag);
        var href = contactTag.find('a.app-aware-link')[0].href;
        if (! href.startsWith("https://www.linkedin.com/in/")) {
            continue
        }
        var url = href.split('?')[0];
        var id = url.split('/in/')[1];
		var contact = null;
        if (id in storage.lk_contacts) {
			contact = storage.lk_contacts[id];
		} else {
            contact = {
                'id': id,
                "url": url,
            };
        }
        var name = contactTag.find('.update-components-actor__name span span')[0].textContent
        var image_url = contactTag.find('img')[0].src;
        // var degree = $(contact).find('.update-components-actor__supplementary-actor-info')[0].textContent.replace(" • ", ""); 
        var desc = contactTag.find('.update-components-actor__description')[0].children[0].textContent.trim();
        contact = {
			"id": id,
            "name": name,
            'img': image_url,
			'url': url,
            // "degree": degree,
            "description": desc,
        };
        storage.lk_contacts[id] = contact
		  console.log(contact)
        browser.storage.local.set(storage);
      }
	});
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

function parseCompany() {
	const reg = /urn:li:fsd_company:(\d*)/g ;
	var companyIds = [...document.body.textContent.matchAll(reg)].map(function(i) {return i[1]});
	const counter = {};
	companyIds.forEach(ele => {
	    if (counter[ele]) {
			counter[ele] += 1;
		} else {
			counter[ele] = 1;
		}
	});
	let id = null;
	let highestValue = -Infinity;
	for (const key in counter) {
	  if (counter[key] > highestValue) {
        id = key;
	    highestValue = counter[key];
      }
	}

	if (!id) return

    var url = document.URL;
	var alias = url.slice(33).replace('/', '');

    browser.storage.local.get().then(function (storage) {
	  if (! (id in storage.lk_companies)) {
	  	company = {id: id, url: url};
	  } else {
	  	company = storage.lk_companies[id];
	  }

	  storage.lk_company_aliases[alias] = {id: id};
	  company.img = $(".org-top-card-primary-content__logo-container img")[0].src 
	  company.name = $('h1').text().trim();
	  
	  var tagLine = $('.org-top-card-summary__tagline').text().trim();
	  if (tagLine) company.tagLine = tagLine

      urlTag = $('.org-contact-info__content a.link-without-visited-state')[0];
	  if (urlTag) {
	    company.companyUrl = urlTag.href.split('?')[0]
	  }

	  $(".org-top-card-summary-info-list__info-item").each(function (i) {
	    var text = this.textContent.trim();
	    if (text.includes("followers")) {
	      company.followers = text.split(" ")[0];
	    } else if (text.includes("employee")) {
	      company.employees = text.split(" ")[0];
	    }

	  });
	  browser.storage.local.set(storage);
	});
}

const seenCommentators = [];
function parseComments() {
    browser.storage.local.get().then(function (storage) {
	  contactTags = $('.comments-comments-list .comments-comment-meta__actor');
	  contactTags.each(function(i) {
	  var tag = this;
      var aTag = tag.querySelector('a.app-aware-link');
      var url = aTag.href;
      if (!url.includes('/in')) return
      
      var id = url.split('/in/')[1];
      if (seenCommentators.includes(id)) return
      this.id = id.replace(/[^a-zA-Z0-9 ]/g, '-')
      
      var contactTag = $(`#${this.id}`);

	  var contact = null;
      if (! (id in storage.lk_contacts)) {
          contact = {
              id: id,
              url: url,
          };
      } else {
          contact = storage.lk_contacts[id]
	  }

	  if (! contact.img) {
	  	contact.img = contactTag.find('img')[0].src;
	  }

	  if (! contact.name) {
	  	contact.name = contactTag.find('h3')[0].textContent.trim();
	  }

	  if (! contact.tagLine) {
	  	var tagLine = contactTag.find('.comments-comment-meta__description-subtitle')[0].textContent.trim();
	  	if (! tagLine.includes('...')) {
	  		contact.tagLine = contactTag.find('.comments-comment-meta__description-subtitle')[0].textContent.trim();
	  		if (! contact.description) contact.description = contact.tagLine
	  	}
	  }
	  storage.lk_contacts[id] = contact
	  seenCommentators.push(id);
	  browser.storage.local.set(storage);
    })
  })
}

function parseReactors() {
  var reactorTags = $('.social-details-reactors-modal .link-without-hover-state')
  browser.storage.local.get().then(function (storage) {
    reactorTags.each(function(i) {
      var url = this.href;
      var aliasId = url.split('/in/')[1];

      var alias = null;
      if (aliasId in storage.lk_tmp_contact_aliases) {
        alias = storage.lk_tmp_contact_aliases[aliasId];
      } else {
        alias = {
            id: aliasId,
            url: url,
        };
      }

      this.id = aliasId
      var aliasTag = $(`#${this.id}`);
      alias.name = aliasTag.find('.artdeco-entity-lockup__title .text-view-model').text().trim();
      alias.degree = aliasTag.find('.artdeco-entity-lockup__badge').text().trim().split(' ')[0];
      alias.tagLine = aliasTag.find('.artdeco-entity-lockup__caption').text().trim();
	  
	  var imgTag = aliasTag.find('img.ivm-view-attr__img--centered')[0]
      if (imgTag) alias.img = imgTag.src;

      storage.lk_tmp_contact_aliases[aliasId] = alias;
    });
    browser.storage.local.set(storage);
  });
  cleanContactAliases();
}

function parseSearchPeople() {
  contactTags = $('[data-view-name="search-entity-result-universal-template"]');
  browser.storage.local.get().then(function (storage) {
    contactTags.each(function(i) {
	  var contentTag = $(this);
	  var aTag = contentTag.find('a.app-aware-link')[0];
      var url = aTag.href;
      var id = url.split('?')[0].split('/in/')[1];

      var contact = null;
      if (id in storage.lk_contacts) {
        contact = storage.lk_contacts[id];
      } else {
        contact = {
            id: id,
            url: url,
			relations: [],
        };
      }

      contact.name = contentTag.find('.entity-result__title-line a.app-aware-link [aria-hidden="true"]')[0].textContent.trim();
      contact.degree = contentTag.find('.entity-result__badge .visually-hidden')[0].textContent.trim().split(' ')[0];
      var tagLine = contentTag.find('.entity-result__primary-subtitle').text().trim();
	  if (! tagLine.includes('...')) contact.tagLine = tagLine
      var imgTag = contentTag.find('img');
	  if (imgTag.length) contact.img = imgTag[0].src;
	  if (! contact.relations) contact.relations = [];

	  var urlParams = new URLSearchParams(document.URL.split('?')[1]);
	  var new_connections = [];

	  var facetConnection = urlParams.get('facetConnectionOf');
	  if (facetConnection) {
		facetConnection = JSON.parse(facetConnection);
		new_connections.push(facetConnection);
	  }
	  var connectionOf = urlParams.get('connectionOf');
	  if (connectionOf) {
		connectionOf = JSON.parse(connectionOf);
		new_connections = new_connections.concat(connectionOf);
	  }
	  new_connections.map(function(conn) {
		  if (! contact.relations.includes(conn)) contact.relations.push(conn);
	  });

	  var currentCompany = urlParams.get('currentCompany');
	  if (currentCompany) {
		currentCompany = JSON.parse(currentCompany);
		if (currentCompany.length == 1) contact.currentCompany = currentCompany
	  }

	  storage.lk_contacts[id] = contact;
	})
    browser.storage.local.set(storage);
  });
}

addEventListener("scrollend", (event) => {
    if (document.URL == "https://www.linkedin.com/feed/") {
        parseFeed()
        parseComments()
    }
    if (document.URL.startsWith('https://www.linkedin.com/in/')) {
        parsePerson()
    }
    if (document.URL.startsWith('https://www.linkedin.com/feed/update/urn:li:activity:')) {
        // parseSocialReactor()
        parseComments();
        parseReactors();
    }
    if (document.URL.startsWith('https://www.linkedin.com/company/')) {
        parseComments()
    }
    if (document.URL.startsWith('https://www.linkedin.com/posts/')) {
        parseCompany()
    }
    if (document.URL.startsWith('https://www.linkedin.com/search/results/people/')) {
        parseSearchPeople()
    }
});
