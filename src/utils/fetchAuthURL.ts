const fetchAuthURL = () => {
    console.log('get auth URL');
    var retval = { // Default config
        url: process.env.REACT_APP_authURL || ''
    }
    console.log(retval.url);
    return retval.url;
}

export default fetchAuthURL;