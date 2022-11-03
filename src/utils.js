const { default: axios } = require("axios")

exports.protected_axios = (path, data, ) => {
    return axios.post(path, data, {

    })
}

exports.getApiPath = (path) => {
    // console.log(window.location.protocol + "//" + window.location.hostname + ":3000" + "/" + path)
    //return window.location.protocol + "//" + window.location.hostname + ":3000" + "/" + path;
    return "/" + path;
}

exports.validateEmail = (mail) => {

 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}

exports.capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}