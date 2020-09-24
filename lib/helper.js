/* eslint-disable no-param-reassign */
const _censorDeep = function (obj, censorKeyArray) {
  if (censorKeyArray.length === 0 && typeof obj !== "undefined") {
    // this means function reach its base condition, return censor
    return "**CENSORED**"
  }
  const targetKey = censorKeyArray[0]
  if (Array.isArray(obj) && obj.length > 0 && targetKey !== undefined) {
    if (targetKey === "*") {
      const mappedArray = obj.map(function (item) {
        const restKey = censorKeyArray.slice(1, censorKeyArray.length)
        return _censorDeep(item, restKey)
      })
      return mappedArray
    }
    if (obj[targetKey] !== undefined) {
      obj[targetKey] = _censorDeep(
        obj[targetKey],
        censorKeyArray.splice(1, censorKeyArray.length),
      )
    }
    return obj
  }
  if (obj instanceof Object && obj[targetKey] !== "undefined") {
    obj[targetKey] = _censorDeep(
      obj[targetKey],
      censorKeyArray.splice(1, censorKeyArray.length),
    )
    return obj
  }
  return obj
}

const _censorURLParameter = function (url, parameter) {
  // eslint-disable-next-line no-console
  console.log("_censorURLParameter -> url, parameter", url, parameter)

  //  prefer to use l.search if you have a location/link object
  const urlparts = url.split("?")
  if (urlparts.length >= 2) {
    const prefix = `${encodeURIComponent(parameter)}=`
    const pars = urlparts[1].split(/[&;]/g)

    //  reverse iteration as may be destructive
    for (let i = pars.length - 1; i >= 0; i -= 1) {
      //  idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1)
      }
    }

    return `${urlparts[0]}${
      pars.length > 0 ? `?${pars.join("&")}&${parameter}=**CENSORED**` : ""
    }`
  }
  return url
}

exports.censor = function (obj, censorKeyArray) {
  censorKeyArray.forEach(function (key) {
    // split with dot notation
    const keyArray = key.split(".")
    if (keyArray.length >= 1) {
      // this mean the key exist
      const targetKey = keyArray[0]
      if (typeof obj[targetKey] !== "undefined") {
        obj[targetKey] = _censorDeep(
          obj[targetKey],
          keyArray.splice(1, keyArray.length),
        )
      }
      if (targetKey === "apiKey") {
        // eslint-disable-next-line no-console
        console.log(obj)
        if (obj["x-original-uri"]) {
          obj["x-original-uri"] = _censorURLParameter(
            obj["x-original-uri"],
            "apiKey",
          )
        }

        // obj.originalUrl = _censorURLParameter(obj.originalUrl, "apiKey")
      }
    }
  })
}

exports._censorDeep = _censorDeep

const deepMerge = (b, a, mergeArray) => {
  if (mergeArray && Array.isArray(a) && Array.isArray(b)) {
    return [...b, ...a].filter((v, i, arr) => arr.indexOf(v) === i)
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return b
  }
  Object.keys(b).forEach((key) => {
    if (typeof b[key] === "object" && ![null, undefined].includes(b[key])) {
      a[key] = deepMerge(
        b[key],
        typeof a[key] === "object" ? a[key] : {},
        mergeArray,
      )
    } else {
      a[key] = b[key]
    }
  })
  return a
}

exports.deepMerge = deepMerge

exports.indexDateQuarter = (date) =>
  `${date.toISOString().substr(0, 4)}-q${Math.ceil(
    +date.toISOString().substr(5, 2) / 3,
  )}`

exports.indexDateHalfYear = (date) =>
  `${date.toISOString().substr(0, 4)}-h${Math.ceil(
    +date.toISOString().substr(5, 2) / 6,
  )}`

exports.indexDateMonth = (date) => date.toISOString().substr(0, 7)
