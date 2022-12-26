import axios from "axios";

export const makeAPIcall = async (url, method, data, header) => {
  try {
    let apiObjAxios = { url, method };
    if (method === "POST" || method === "PUT") {
      apiObjAxios.data = data;
    }
    apiObjAxios.header = header;
    // console.log("REq in apicall ",JSON.stringify(apiObjAxios))
    return new Promise((resolve, reject) => {
      axios(apiObjAxios)
        .then(async (resp) => {
          // console.log("resp from axios ",(resp))
          resolve(resp);
        })
        .catch((err) => {
          // console.log("err from apicall", err);
          reject(err);
        });
    });
  } catch (e) {
    // console.log("err from apicall", e);
  }
};
