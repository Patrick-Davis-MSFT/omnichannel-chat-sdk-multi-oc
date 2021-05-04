const fetchOmnichannelConfig = (chatIDX: number) => {
  var temp = { object: process.env.REACT_APP_OmniConfig || '' };
  if (temp.object !== '') {
    var testVal = JSON.parse(temp.object);
    if (testVal[chatIDX]) {
      var omnichannelConfig = { // Default config
        orgId: testVal[chatIDX].orgId || '',
        orgUrl: testVal[chatIDX].orgUrl || '',
        widgetId: testVal[chatIDX].widgetId || ''
      };
      return omnichannelConfig;
    }
  }
  var emptyConfig = { // Default config
    orgId: '',
    orgUrl: '',
    widgetId: ''
  };
  return emptyConfig;
}

export default fetchOmnichannelConfig;