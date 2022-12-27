import GET_URL from "../Config/Constant";
import { makeAPIcall } from "../Config/makeAPIcall";

export const getTableData = async () => {
  try {
    let res = await makeAPIcall(GET_URL, "GET", "", "");
    return res;
  } catch (e) {
    throw new Error("Something went wrong");
  }
};
