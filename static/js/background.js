// Context Menu aka Right click
browser.contextMenus.create({
  id: "show-lk-contacts",
  title: "Show Linkedin contacts",
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "show-lk-contacts") {
      browser.tabs.create({ url: 'home.html' });
  }
});
