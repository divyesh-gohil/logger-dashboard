import axios from "axios";

export const makeAPIcall = async (url, method, data, header) => {
  try {
    let apiObjAxios = { url, method };
    if (method === "POST" || method === "PUT") {
      apiObjAxios.data = data;
    }
    apiObjAxios.header = header;
    return new Promise((resolve, reject) => {
      axios(apiObjAxios)
        .then(async (resp) => {
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (e) {}
};
