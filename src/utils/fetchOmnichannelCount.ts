const fetchOmnichannelCount = () => {
    var temp = { object: process.env.REACT_APP_OmniConfig || ''};
      if (temp.object !== ''){
      var testVal = JSON.parse(temp.object);
      return testVal.length;
      }
      return 0;
  }
  export default fetchOmnichannelCount;