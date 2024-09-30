const config = {};

function refreshConfig (storage) {
  for (var key in storage.config) {
    config[key] = storage.config[key];
  }
}

browser.storage.local.get().then(function (storage) {
  refreshConfig(storage)
  console.log("Config: ", config)
});

function updateConfig (storage, key, value) {
  config[key] = value;
  storage.config[key] = value;
  browser.storage.local.set(storage);
}

function parserIsEnabled () {
  browser.storage.local.get().then(function (storage) {
    config.parserEnabled = storage.config.parserEnabled
  })
  return config.parserEnabled
}
