// const stringManipulator = (arr, splitter, operation) => {
//   array.forEach(currentItem => {});
//   arr.map((u, i) => {});
// };
import queryString from "query-string";
import Pluralize from "pluralize";

// import underscore from "underscore.string";
import { pascalCase, underscore, camelCase } from "../strings/stringHelper";
// import { camelCase } from "lodash";

// export const returnQueryString = (obj) => {
export const returnQueryString = (obj) => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};
export const pluralizeName = (str) => {
  return Pluralize(str);
};

export const getPascalCase = (str) => {
  return pascalCase(str);
};
export const getPluralPascalCase = (str) => {
  return Pluralize(getPascalCase(str));
};

export const getCamelCase = (str) => {
  return camelCase(str);
};
export const getPluralCamelCase = (str) => {
  return Pluralize(getCamelCase(str));
};

export const getUnderscore = (str) => {
  return underscore(str);
};
export const getPluralUnderscore = (str) => {
  return Pluralize(getUnderscore(str));
};
export const getResourceNameSet = (str) => {
  return {
    resourceCamelCaseName: getCamelCase(str),
    resourcePluralCamelCaseName: getPluralCamelCase(str),
    resourcePascalCaseName: getPascalCase(str),
    resourcePluralPascalCaseName: getPluralPascalCase(str),
    resourceUnderscoreName: getUnderscore(str),
    resourcePluralUnderscoreName: getPluralUnderscore(str),
  };
};
// export const customDebounce = function (a, b, c) {
//   var d, e;
//   return function () {
//     function h() {
//       (d = null), c || (e = a.apply(f, g));
//     }
//     var f = this,
//       g = arguments;
//     return (
//       clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
//     );
//   };
// };
export const getUUid = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
export const returnSelectorProps = (selectorsObj, props) => {
  let returnObj = {};
  // console.log("selectosObj", selectorsObj);
  for (const key in selectorsObj) {
    if (selectorsObj.hasOwnProperty(key) && props.hasOwnProperty(key)) {
      returnObj[key] = props[key];
    }
  }
  return returnObj;
};

export const mapStateToPropsBuilder = (state, selectorsObj, props = {}) => {
  let returnObj = {};
  // console.log("selectosObj", selectorsObj);
  for (const key in selectorsObj) {
    if (selectorsObj.hasOwnProperty(key)) {
      const selector = selectorsObj[key];
      if(typeof selector == "function"){
        if (typeof selector() == "function") {
          // created by reselect(memoized)
          returnObj[key] = selector()(state, props);
        } else {
          returnObj[key] = selector(state, props);
        }

      } else {
        console.log("Invalid selector");
      }
      // returnObj[key] = selector()(state, props);
    }
  }
  return returnObj;
};


export const MrAxiosInstanceMethodBuilder = (axios, configOptions = {}, tokenKey = "token") => {
  const makeAxiosInstance = (token = null, options = {}) => {
    const axiosObj = {
      token: token,
      
      createInstance: () => {
        return axios.create({
          // baseURL: "https://react-burger.firebaseio.com/",
          // baseURL: "http://172.17.0.1:3003/api/v1/",
          // baseURL: "http://http://192.168.43.218:3003/api/v1/",
          // baseURL: "http://0.0.0.0:3004/api/v1/",
          baseURL: "http://localhost:3005/api/v1/",
          // baseURL: "https://test.assessprep.com/api/v1/",
          // transformRequest: [
          //   function(data, headers) {
          //     // Do whatever you want to transform the data

          //     return data;
          //   },
          // ],
          // // `transformResponse` allows changes to the response data to be made before
          // // it is passed to then/catch
          // transformResponse: [
          //   function(data) {
          //     // Do whatever you want to transform the data

          //     return data;
          //   },
          // ],
          // `headers` are custom headers to be sent
          // headers: { token: localStorage.getItem("token") },
          headers: { token: axiosObj.token },
          // headers: { token,},
          // `params` are the URL parameters to be sent with the request
          // Must be a plain object or a URLSearchParams object
          // params: {
          //   ID: 12345
          // },
          // // `responseType` indicates the type of data that the server will respond with
          // // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
          // responseType: 'json', // default

          // `timeout` specifies the number of milliseconds before the request times out.
          // If the request takes longer than `timeout`, the request will be aborted.
          timeout: 10000,
          ...configOptions,
          ...options,

          // // `onUploadProgress` allows handling of progress events for uploads
          // onUploadProgress: function (progressEvent) {
          //   // Do whatever you want with the native progress event
          // },
          // proxy: {
          //   host: "127.0.0.1",
          //   port: 3000,
          //   // auth: {
          //   //   username: 'mikeymike',
          //   //   password: 'rapunz3l'
          //   // }
          // },
          // // `onDownloadProgress` allows handling of progress events for downloads
          // onDownloadProgress: function (progressEvent) {
          //   // Do whatever you want with the native progress event
          // },
        });
      },
      instance: null,
      resetInstance: () => {
        axiosObj.token = localStorage.getItem(tokenKey);
        axiosObj.instance = axiosObj.createInstance();
      },
    };
    axiosObj.resetInstance();
    return axiosObj;
  };
  return makeAxiosInstance;
};


export const formatJsonApiData = (response) => {
  // console.log("response", response);
  let finalResponse;
  if (response.hasOwnProperty("data")) {
    response = response.data;
  }
  if (Array.isArray(response)) {
    finalResponse = [];
    response.forEach((element) => {
      finalResponse.push(formatJsonApiData(element));
    });
    return finalResponse;
  }
  if (response.hasOwnProperty("attributes")) {
  } else {
    return response;
  }
  console.log( "response 201", response );
  let finalObj = {
    ...response.attributes,
  };
  // console.log("finalObj1", finalObj);

  if (response.hasOwnProperty("relationships")) {
    let relationshipsObj = {};
    for (const key in response.relationships) {
      if (response.relationships.hasOwnProperty(key)) {
        const element = response.relationships[key];
        if (element.data) {
          let tempObj = formatJsonApiData(element.data);
          console.log("tempObj", tempObj);
          // debugger;
          const { type, ...finalElemData } = element.data;
          relationshipsObj[key] = { ...finalElemData };
        }
      }
    }

    finalObj = {
      ...finalObj,
      ...relationshipsObj,
    };
  }

  // console.log("finalObj", finalObj);
  return finalObj;
};

export const mergeFunction = (obj, srcValues) => {
  if(Array.isArray(obj) && Array.isArray(srcValues)){
    if(srcValues.length != obj.length){
      // const finalValues = srcValues.map((item, index) => {
        
      // })
      console.log("objValues", obj);
      console.log("srcValues", srcValues);
      return srcValues;
    }
  }
}

export const setQueryParamsV1 = (options) => {
  let { url, history, location, newParams, removeParams } = options;
  let updatedNewParams = {};
  for (const key in newParams) {
    if (newParams.hasOwnProperty(key)) {
      const element = newParams[key];
      if (newParams[key] === null || newParams[key] === "null") {
        if (!removeParams) {
          removeParams = [];
        }
        removeParams.push(key);
      } else {
        updatedNewParams[key] = element;
      }
    }
  }

  // const queryParams = {
  //   ...queryString.parse(location.search),
  //   ...queryString.parse(location.search),
  //   ...newParams
  // };
  const queryParams = {
    ...queryString.parse(location.search),
    ...queryString.parse(location.search),
    ...updatedNewParams,
  };

  if (removeParams) {
    removeParams.forEach((element) => {
      if (queryParams.hasOwnProperty(element)) {
        delete queryParams[element];
      }
    });
  }
  // let { queryParamsWithRemovedParams, ...removeParams } = queryParams;

  // let finalQueryParams = queryString.stringify(queryParamsWithRemovedParams);
  // let finalQueryParams = queryString.stringify(queryParamsWithRemovedParams);
  let finalQueryParams = queryString.stringify(queryParams);
  console.log("url", url);
  history.push(`${url}?${finalQueryParams}`);
  // history.push({ pathname: url, search: `?${finalQueryParams}` });
  console.log("finalQueryParams", finalQueryParams);
};

export const setQueryParams = (options) => {
  let { url, history, location, params } = options;
  const finalQueryParams = {}
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const element = params[key];
      if (!(params[key] === null || params[key] === "null" || params[key] === "")) {
        finalQueryParams[key] = element;
      }
    }
  }
  console.log( "finalQueryParams", finalQueryParams );
  
  let finalQueryParamsStr = queryString.stringify(finalQueryParams);
  console.log( "finalQueryParamsStr", finalQueryParamsStr );
  
  history.push(`${url}?${finalQueryParamsStr}`);
  // history.push({ pathname: url, search: `?${finalQueryParams}` });
  // console.log("finalQueryParams", finalQueryParams);
};


export const returnFinalValue = (event, controlName) => {
  let finalValue;
  if (controlName === "object") {
    finalValue = event;
  } else if (typeof event == "string") {
    finalValue = event;
  } else if (Array.isArray(event)) {
    finalValue = event;
  } else {
    if (event && event.hasOwnProperty("target")) {
      if (event.target.hasOwnProperty("checked")) {
        finalValue = event.target.checked;
      } else {
        finalValue = event.target.value;
      }
    } else {
      finalValue = event;
    }
  }
  return finalValue;
};
export const getQueryParams = (options) => {
  let { location } = options;
  let finalQueryParams = queryString.parse(location.search);
  return finalQueryParams;
};

export const shallowCompare = (obj1, obj2) =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  );

const MrHelperMethods = {
  getQueryParams,
  returnFinalValue,
  setQueryParams,
  mapStateToPropsBuilder,
  returnSelectorProps,
  getResourceNameSet,
  returnQueryString


}
export const cloneObject = obj => {
  let clone = {};
  if (Array.isArray(obj)) {
    clone = [];
  }
  for (var i in obj) {
    if (obj[i] != null && typeof obj[i] == "object")
      clone[i] = cloneObject(obj[i]);
    else clone[i] = obj[i];
  }
  return clone;
};
export const updateNested = (propertyPath, value, obj = {}, extraOpts = {}) => {
  // if (controlName === "object") {
  //   finalValue = event;
  // } else {}
  if (extraOpts.debugger) {
    // debugger;
  }
  let finalValue;
  if (typeof value === "function") {
    finalValue = value.target.value;
  } else {
    finalValue = value;
  }
  // let finalObj = JSON.parse(JSON.stringify(obj));
  let finalObj = cloneObject(obj);
  if (recNest(propertyPath, finalValue, finalObj)) {
    return finalObj;
  } else {
    return finalObj;
  }
};
// export const usingUpdateMethod = (propertyPath, value, obj = {}){

// }

export const getNested = (propertyPath, obj = {}) => {
  let properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split(".");
  if (properties.length > 1) {
    if (
      !obj.hasOwnProperty(properties[0]) ||
      typeof obj[properties[0]] !== "object"
    ) {
      // obj[properties[0]] = {};
      return undefined;
    }
    return getNested(properties.slice(1), obj[properties[0]]);
    // doneProperties.push(properties[0]);
    // let tempObj = recNest(
    //   properties.slice(1),
    //   value,
    //   finalObj[properties[0]],
    //   doneProperties
    // );

    // console.log("length 1", finalObj, value);
  } else {
    // obj[properties[0]] = value;
    return obj[properties[0]];
  }
};
export const recNest = (propertyPath, value, obj = {}, options = {}) => {
  console.log("propertyPath, obj, value", propertyPath, obj, value);
  // let keyArr = propertyPath.split(".");
  let properties = Array.isArray(propertyPath)
    ? propertyPath
    : propertyPath.split(".");

  if (properties.length > 1) {
    if (
      !obj.hasOwnProperty(properties[0]) ||
      typeof obj[properties[0]] !== "object"
    ) {
      obj[properties[0]] = {};
      if (typeof properties[1] !== undefined) {
        let index = parseInt(properties[1]);
        if (!isNaN(index)) {
          obj[properties[0]] = [];
        }
        console.log("index", index);
      }
      // if(properties[0] ==)
    }
    return recNest(properties.slice(1), value, obj[properties[0]]);
    // doneProperties.push(properties[0]);
    // let tempObj = recNest(
    //   properties.slice(1),
    //   value,
    //   finalObj[properties[0]],
    //   doneProperties
    // );

    // console.log("length 1", finalObj, value);
  } else {
    if (Array.isArray(value)) {
      obj[properties[0]] = value;
    } else if (typeof value === "object") {
      // console.log("last obj", obj);
      obj[properties[0]] = {
        ...obj[properties[0]],
        ...value,
      };
    } else {
      obj[properties[0]] = value;
    }
    // obj[properties[0]] = value;
    return true;
  }

  // console.log("finalObj", finalObj);
};

export default MrHelperMethods;