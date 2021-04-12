const fetchOmnichannelConfig = (altChannel = false) => {
  var omnichannelConfig = { // Default config
    orgId: process.env.REACT_APP_orgId || '',
    orgUrl: process.env.REACT_APP_orgUrl || '',
    widgetId: process.env.REACT_APP_widgetId || ''
  };

  console.log('value of altChannel: ' + altChannel) ;
  if (altChannel === true){  
    console.log('Using Alt Channel: ' + altChannel) ;
    omnichannelConfig.orgId = process.env.REACT_APP_orgId2!;
    omnichannelConfig.orgUrl = process.env.REACT_APP_orgUrl2!;
    omnichannelConfig.widgetId = process.env.REACT_APP_widgetId2!;
  }

  return omnichannelConfig;
}



export default fetchOmnichannelConfig;