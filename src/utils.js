const { default: axios } = require("axios")

exports.protected_axios = (path, data, ) => {
    return axios.post(path, data, {

    })
}

exports.getApiPath = (path) => {
    return window.location.protocol + window.location.host + path;
}

exports.validateEmail = (mail) => {

 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}