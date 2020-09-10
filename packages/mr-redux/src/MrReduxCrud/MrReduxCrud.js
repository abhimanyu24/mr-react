// import { makeAxiosInstance } from "../../../api/apiModule";
// import { nameHandler } from "./reduxHelper";
import { delay } from "redux-saga";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// import underscore from "underscore.string";
// import lodash from "lodash";
// import { findIndex } from "lodash";
// import { returnQueryString } from "../helpers/helperMethods";
// import { message } from "antd";
// import queryString from "query-string";
// import { getNested } from "../../utils/validationHelper";
// import { formatJsonApiData } from "../../utils/helperMethods";
import {getNested, formatJsonApiData, pascalCase, camelCase, underscore as underscored, findIndex} from "@aj/mr-helper";
// import {
//   createActionTypes,
//   actionCreatorFor,
//   mrReducer,
//   genericSaga
// } from "./reduxHelper";

// const axiosInstance = makeAxiosInstance();
let sampleProps = {
  reducer: {},
  actions: {},
  actionTypes: {}
};
export const nameHandler = {
  upCase: (str = "") => str.toUpperCase(),


  // pascalCase: (str = "") => underscore.classify(str),
  pascalCase: (str = "") => pascalCase(str),
  // camelCase: (str = "") => underscore.camelize(str, true),
  camelCase: (str = "") => camelCase(str),

  lowerCase: (str = "") => str.toLowerCase(),
  actionTypeName: (str = "") => {
    this.upCase(str);
  }
};
const getActionTypeName = (resourceName, actionType, eventName) => {
  let actionTypeStr =
    actionType.toUpperCase() + "_" + resourceName.toUpperCase();
  if (eventName) {
    actionTypeStr = actionTypeStr + "_" + eventName.toUpperCase();
  }
  return actionTypeStr;
};
export const returnActionTypeName = arr => {
  return arr
    .map(str => {
      if (str && str != "") {
        return str.toUpperCase();
      }
    })
    .join("_");
};
export const returnCamelCase = arr => {
  return camelCase(arr
    .map(str => {
      if (str && str != "") {
        return str.toLowerCase();
      }
    })
    .join("_"));
  // return underscore.camelize(
  //   arr
  //     .map(str => {
  //       if (str && str != "") {
  //         return str.toLowerCase();
  //       }
  //     })
  //     .join("_"),
  //   true
  // );
};
class MrReduxCrud {
  constructor(props) {
    // super(props);
    this.resourceName = props.resourceName;
    this.singleResourceName = props.singleResourceName || this.resourceName;
    this.apiUrl = props.apiUrl;
    this.actionNames = props.actionNames;
    this.eventNames = props.eventNames || ["START", "SUCCESS", "FAIL"];
    this.overrides = props.overrides || { reducer: {} };
    this.axiosInstance = props.axiosInstance;
    // this.message = props.message || message;
    this.message = props.message;
    console.log("this.axiosInstance", this.axiosInstance);
    // if(props.overrides){
    //   for (const key in props.overrides) {
    //     if (props.overrides.hasOwnProperty(key)) {
    //       const value = props.overrides[key];
    //       this[key] = value;
    //       // this.actions = props.actions;
    //       // this.actionTypes = props.actionTypes;
    //       // this.reducer = props.reducer;
    //     }
    //   }
    // }
    this.actionTypes = this.createActionTypes(
      this.resourceName,
      this.actionNames
    );
    this.actions = this.actionCreatorFor(this.resourceName, this.actionNames);

    // construct actionTypes

    // construct actions
    // construct reducer
    // construct saga
  }
  getActionTypes() {
    return this.actionTypes;
  }
  createActionTypes = (resourceName, actionsArr = []) => {
    let actionTypesObj = {};
    if (actionsArr.length == 0) {
      actionsArr = ["FETCH", "CREATE", "UPDATE", "DELETE", "SHOW"];
    }
    let eventsArr = ["START", "SUCCESS", "FAIL"];
    actionsArr.forEach(action => {
      actionTypesObj[
        getActionTypeName(resourceName, action)
      ] = getActionTypeName(resourceName, action);
      eventsArr.forEach(event => {
        actionTypesObj[
          getActionTypeName(resourceName, action, event)
        ] = getActionTypeName(resourceName, action, event);
      });
    });
    return actionTypesObj;
  };

  actionCreatorFor = (resourceName, actionsArr = []) => {
    let eventsArr = ["START", "SUCCESS", "FAIL"];
    if (actionsArr.length == 0) {
      actionsArr = ["FETCH", "CREATE", "UPDATE", "DELETE", "SHOW"];
    }

    let actionCreator = {};
    const upCaseResourceName = resourceName.toUpperCase();
    const pluralResourceName = `${resourceName}s`;
    const upCasePluralResourceName = pluralResourceName.toUpperCase();

    actionsArr.forEach(action => {
      eventsArr.forEach(event => {
        let actionType = `${action}_${upCaseResourceName}_${event}`;
        const actionObj = (payload, options = {}) => {
          return {
            type: actionType,
            // ...data,
            payload,
            options
          };
        };
        // console.log("actionObj", actionObj);
        let camelCaseActionType = nameHandler.camelCase(
          `${action.toLowerCase()}${nameHandler.pascalCase(
            event.toLowerCase()
          )}`
        );
        actionCreator[camelCaseActionType] = actionObj;
        actionCreator[actionType] = actionObj;
      });
      let actionType = `${action}_${upCaseResourceName}`;
      const actionObj = (payload, options = {}) => {
        return {
          type: actionType,
          // ...data,
          payload,
          options
        };
      };
      // console.log("actionObj", actionObj);
      let camelCaseActionType = nameHandler.camelCase(
        `${action.toLowerCase()}`
      );
      actionCreator[camelCaseActionType] = actionObj;
      actionCreator[actionType] = actionObj;
    });
    return actionCreator;
  };
  getActions() {
    return this.actions;
  }

  getReducer(initialState, overrides = {}) {
    return this.generateReducer(initialState, overrides);
  }
  generateReducer(initialState = {}, actionMutationMap = {}) {
    return (state = initialState, action) => {
      const options = action.options || {};
      const upCaseResourceName = this.resourceName.toUpperCase();
      const pluralResourceName = options.resourceName || (this.singleResourceName + "s") || (this.resourceName + "s");
      console.log( "this.resourceName, this.singleResourceName", this.resourceName, this.singleResourceName );
      
      const loadingKey = action.type.split("_")[0].toLowerCase();
      if (actionMutationMap[action.type]) {
        return actionMutationMap[action.type](state, action);
      } else {
        if (this.actionTypes.hasOwnProperty(action.type)) {
          if (action.type.indexOf("START") != -1) {
            // return state.set("loading", true).setIn([loadingKey, "loading"], true);
            return state.set("loading", true).setIn([`${loadingKey}loading`], true);
          } else if (action.type.indexOf("SUCCESS") != -1) {
            // debugger;
            
            console.log("action", action);
            console.log("state", state);
            // let newState = state.set("loading", false).setIn([loadingKey, "loading"], false);
            let newState = state.set("loading", false).setIn([`${loadingKey}loading`], false);
            // let newState = state.set("loading", false);
            let metaObj = {};
            if (action.payload) {
              let isSingleResource = false;
              if (action.type.indexOf("SHOW") !== -1) {
                isSingleResource = true;
              }
              const data = action.payload.data;
              if(!data){
                debugger;
              }
              for (const key in data) {
                if (data.hasOwnProperty(key)) {
                  const value = data[key];
                  console.log("key, value 201", key, value);
                  console.log( "pluralResourceName", pluralResourceName );
                  if (state.has(key)) {
                    if(key === pluralResourceName){
                      // debugger;
                      newState = newState.set(key, formatJsonApiData(value));
                    } else {
                      // value = formatJsonApiData(value)
                      newState = newState.set(key, value);
                    }
                  } else {
                    // console.log( "options.resourceName, key", options.resourceName, key );
                    if(options.apiResourceName && options.apiResourceName === key){
                      // newState = newState.set(key, formatJsonApiData(value));
                      newState = newState.set(options.resourceName, formatJsonApiData(value));

                    } else {
                      metaObj[key] = value;
                    }
                  }
                }
              }
              let isCreateUpdate = false;
              // debugger;
              let updatedResources;
              // if (isSingleResource) {
              //   updatedResources = { ...newState.get(this.resourceName) };
              // } else {
              // }
              console.log( "pluralResourceName", pluralResourceName );
              updatedResources = [...newState.get(pluralResourceName, [])];
              let apiResource;

              if (data.hasOwnProperty(this.singleResourceName)) {
                apiResource = data[this.singleResourceName];
                apiResource = formatJsonApiData(apiResource);
                
                // apiResource = formatJsonApiData(apiResource);
                // apiResource = formatJsonApiData(apiResource);
              } else {
                if (data.hasOwnProperty("data")) {
                  apiResource = formatJsonApiData(data.data[this.singleResourceName]);
                  
                } 
              }

              // console.log("apiResource", apiResource, data);

              if (action.type.indexOf("SHOW") !== -1) {
                // updatedResources = apiResource;
                const idx = findIndex(updatedResources, {
                  id: apiResource.id
                });
                if (idx !== -1) {
                  updatedResources.splice(idx, 1, apiResource);
                } else {
                  updatedResources.unshift(apiResource);
                }

                // this.message.success(`${this.resourceName} successfully created.`);
              } else if (action.type.indexOf("CREATE") !== -1) {
                // debugger;
                console.log( "action", action );
                if(action.options && typeof(action.options.createAtIndex) !== "undefined"){
                  updatedResources.splice(options.createAtIndex, 0, apiResource);
                } else {
                  updatedResources.unshift(apiResource);

                }
                isCreateUpdate = true;
                this.message.success(
                  `${this.resourceName} successfully created.`
                );
              } else if (action.type.indexOf("UPDATE") !== -1) {
                const idx = findIndex(updatedResources, {
                  id: apiResource.id
                });
                // debugger;
                this.message.success(
                  `${this.resourceName} successfully updated.`
                );
                // debugger;
                console.log("idx", idx);
                if (idx !== -1) {
                  updatedResources.splice(idx, 1, apiResource);
                  // updatedResources[idx] = ;
                  isCreateUpdate = true;
                }
              } else if (action.type.indexOf("DELETE") !== -1) {
                const idx = findIndex(updatedResources, {
                  id: apiResource.id
                });
                // debugger;
                // console.log("idx", idx);
                if (idx !== -1) {
                  updatedResources.splice(idx, 1);
                  // updatedResources[idx] = ;
                  isCreateUpdate = true;
                }
                this.message.success(
                  ` ${this.resourceName} successfully deleted`
                );
              } else if (action.type.indexOf("DUPLICATE") !== -1){

              }
              // if (isSingleResource) {
              //   newState = newState.set(this.resourceName, updatedResources);
              // } else {
              // }
              if (
                (isCreateUpdate || isSingleResource) &&
                state.has(pluralResourceName)
              ) {
                newState = newState.set(pluralResourceName, updatedResources);
              }
            }
            newState = newState.set("extra", metaObj);
            console.log("newState", newState);
            // if (action.data) {
            //   newState = newState.set("data", action.data);
            // }
            // if (action.type.indexOf("FETCH") != -1) {
            //   newState = newState.set(`${resourceName}s`, action.records);
            // } else {
            //   newState = newState.set(resourceName, action.record);
            // }
            return newState;
          } else if (action.type.indexOf("FAIL") !== -1) {
            console.log("action", action);
            let error = getNested("payload.error", action);
            if (error && typeof error === "string") {
              console.log("error", error);

              this.message.error(error);
            } else {
              this.message.error(
                `Something went wrong in processing ${this.resourceName}`
              );
            }

            return state.set("error", action.error).set("loading", false).setIn([`${loadingKey}loading`], false);
          } else {
            return state;
          }
        } else {
          return state;
        }
      }
    };
  }
  generateWatchSaga = (overrides = {}, callbacks = {}) => {
    let parentThis = this;
    return function*() {
      // let url = parentThis.resourceName + "s";
      // let baseUrl = parentThis.resourceName + "s";
      // let requestType = "get";
      for (let i = 0; i < parentThis.actionNames.length; i++) {
        // let url = parentThis.resourceName + "s";
        let url = parentThis.apiUrl || parentThis.resourceName + "s";
        let baseUrl = parentThis.apiUrl || parentThis.resourceName + "s";
        if (overrides.baseUrl) {
          baseUrl = overrides.baseUrl;
          url = overrides.baseUrl;
        }
        // debugger;
        let requestType = "get";
        const actionName = parentThis.actionNames[i];
        let actionTypeName = returnActionTypeName([
          actionName,
          parentThis.resourceName
        ]);
        let callbackOverrides = {};
        // debugger;
        if (overrides.hasOwnProperty(actionTypeName)) {
          yield takeLatest(actionTypeName, overrides[actionTypeName]);
          // yield takeEvery(actionTypeName, overrides[actionTypeName]);
        } else {
          if (actionTypeName.indexOf("FETCH") !== -1) {
            url = baseUrl;
            requestType = "get";
            // if (callbacks) {
            //   callbackOverrides = callbacks["FETCH"];
            // }
          } else if (actionTypeName.indexOf("SHOW") !== -1) {
            requestType = "get";
            // if (callbacks) {
            //   callbackOverrides = callbacks["CREATE"];
            // }
          } else if (actionTypeName.indexOf("CREATE") !== -1) {
            requestType = "post";
            // if (callbacks) {
            //   callbackOverrides = callbacks["CREATE"];
            // }
          } else if (actionTypeName.indexOf("UPDATE") !== -1) {
            requestType = "put";
            // if (callbacks) {
            //   callbackOverrides = callbacks["UPDATE"];
            // }
          } else if (actionTypeName.indexOf("DELETE") !== -1) {
            requestType = "delete";
            // if (callbacks) {
            //   callbackOverrides = callbacks["DELETE"];
            // }
          } else {
            requestType = "get";
            callbackOverrides = {};
          }
          if (callbacks.hasOwnProperty(actionTypeName)) {
            callbackOverrides = callbacks[actionTypeName];
          } else {
            callbackOverrides = {};
          }
          console.log("url", url);
          console.log("requestType", requestType);
          // url = baseUrl + "";
          console.log("actionTypeName", actionTypeName);
          // yield takeEvery(
          yield takeLatest(
            actionTypeName,
            parentThis.generateSaga(url, requestType, callbackOverrides)
          );
        }
      }
    };
  };

  generateSaga = (
    parentUrl,
    parentRequestType = "get",
    callbacks = {
      beforeSuccess: false,
      beforeError: false,
      afterError: false,
      afterSuccess: false
    }
  ) => {
    let parentThis = this;
    return function*(action) {
      const options = action.options || {};
      let isShowRequest = false;
      console.log("action 408", action);
      let sagaName = action.type;
      let url = options.url || parentUrl;
      let requestType = parentRequestType;
      // debugger;
      if (action && action.payload && action.payload.id) {
        url += `/${action.payload.id}`;
        if (requestType === "get") {
          isShowRequest = true;
        }
        // requestType = "put";
      }
      let urlSuffix = ".json";
      console.log("requestType", requestType);
      if (url.indexOf(".json") === -1) {
        url += urlSuffix;
      }
      if (requestType === "get") {
        if (action && action.payload && action.payload.params) {
          // url = url + "?" + queryString.stringify(action.payload.params);
        }
      }
      // console.log("url", url);
      // axiosInstance = makeAxiosInstance();
      if (
        !parentThis.axiosInstance.token ||
        !parentThis.axiosInstance.instance
      ) {
        parentThis.axiosInstance.resetInstance();
        console.log("axiosInstance1 ", parentThis.axiosInstance);
      }
      console.log("axiosInstance 2", parentThis.axiosInstance);
      // debugger;

      try {
        console.log("parentThis.actions", parentThis.actions);
        yield put(parentThis.actions[`${sagaName}_START`]());
        // debugger;
        let data;
        if (isShowRequest) {
          data = yield call(
            parentThis.axiosInstance.instance[requestType],
            url
          );
        } else {
          data = yield call(
            parentThis.axiosInstance.instance[requestType],
            url,
            action.payload
          );
        }
        // let finalData = formatJsonApiData(data[parentThis.resourceName]);
        yield put(parentThis.actions[`${sagaName}_SUCCESS`](data, options));
        console.log( "action.options.successCallback", action.options.successCallback );
        if(action.options && action.options.successCallback){
          yield call(action.options.successCallback, data)
        }
        if (callbacks.afterSuccess) {
          yield put({
            type: callbacks.afterSuccess(),
            [parentThis.resourceName]: data.data[parentThis.resourceName]
          });
        }
      } catch (error) {
        console.log("saga fail: ", error);
        let message = getNested(["response", "data", "error"], error);

        if (message) {
          yield put(parentThis.actions[`${sagaName}_FAIL`]({ error: message }, options));
        } else {
          yield put(parentThis.actions[`${sagaName}_FAIL`]({ error: error }, options));
        }

        if (callbacks.afterError) {
          yield put(callbacks.afterError());
        }
      }
    };
  };
}

export default MrReduxCrud;
