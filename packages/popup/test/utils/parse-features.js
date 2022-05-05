exports.parseFeatures = function(raw) {
  return raw.split(/,\s?/).reduce((result, feature) => {
    const [name, value] = feature.split('=');
    result[name] = value;
    return result;
  }, {});
}
