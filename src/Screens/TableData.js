/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useReducer, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { useSearchParams, createSearchParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getTableData } from "../CallApi/GetTableData";
import { getComparator, TableHeader } from "../Component/TableHeader";
import DatePickup from "../Component/DatePickup";

const initialState = {
  logId: "",
  appId: "",
  actionType: "",
  appType: "",
  from: "",
  to: "",
};

const handleReducer = (state, action) => {
  switch (action.type) {
    case "setData":
      // console.log("setData case  ", action.payload);
      return action.payload;
    case "filteredData":
      // console.log("filterData in reducer", action.payload);
      return action.payload;
    default:
      return state;
  }
};

const handleStateReducer = (state, action) => {
  // console.log("val in dispatch ", { state, action });
  switch (action.type) {
    case "logId":
      return { ...state, logId: action.payload };
    case "appId":
      return { ...state, appId: action.payload };
    case "actionType":
      return { ...state, actionType: action.payload };
    case "appType":
      return { ...state, appType: action.payload };
    case "from":
      return { ...state, from: action.payload };
    case "to":
      return { ...state, to: action.payload };
    default:
      console.log("called ", action.type, state);
      return state;
  }
};

export default function TableData() {
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [resp, setResp] = useState([]);
  const [dataFilter, filterDispatch] = useReducer(handleReducer, []);
  const [myState, stateDispatch] = useReducer(handleStateReducer, initialState);
  const [searchParam, setsearchParam] = useSearchParams();
  // handleStateReducer,
  // initialState

  const { logId, appId, appType, actionType, from, to } = myState;

  const applicationTypeList = [
    ...new Set(resp?.map((item) => item.applicationType)),
  ];

  const actionTypeList = [...new Set(resp?.map((item) => item.actionType))];

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const setupParams = () => {
    const params = {};
    logId && Object.assign(params, { logId });
    appId && Object.assign(params, { appId });
    appType && Object.assign(params, { appType });
    actionType && Object.assign(params, { actionType });
    from && Object.assign(params, { from });
    to && Object.assign(params, { to });
    setsearchParam(createSearchParams(params));
  };

  const applyFilter = () => {
    setupParams();
    if (!logId && !appId && !appType & !actionType && !from && !to) {
      // console.log("inside if");
      filterDispatch({ type: "setData", payload: resp });
    } else {
      // console.log("inside else");
      handleFilterData();
      setPage(0);
    }
  };

  const callAPI = useCallback(async () => {
    setLoading(true);
    let resp = await getTableData();
    setResp(resp?.data?.result?.auditLog);
    filterDispatch({ type: "setData", payload: resp?.data?.result?.auditLog });
    setLoading(false);
  }, []);

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    stateDispatch({ type: "logId", payload: searchParam.get("logId") || "" });
    stateDispatch({ type: "appId", payload: searchParam.get("appId") || "" });
    stateDispatch({
      type: "appType",
      payload: searchParam.get("appType") || "",
    });
    stateDispatch({
      type: "actionType",
      payload: searchParam.get("actionType") || "",
    });
    stateDispatch({ type: "from", payload: searchParam.get("from") || "" });
    stateDispatch({ type: "to", payload: searchParam.get("to") || "" });

    handleFilterData();
  }, [searchParam]);

  const handleFilterData = () => {
    const filteredData = () => {
      let logId = searchParam.get("logId") || "";
      let appId = searchParam.get("appId") || "";
      let appType = searchParam.get("appType") || "";
      let actionType = searchParam.get("actionType") || "";
      // console.log("inside filter method", {
      //   logId,
      //   appId,
      //   actionType,
      //   appType,
      // });
      return resp
        .filter((ele) => (logId ? ele.logId?.toString().includes(logId) : ele))
        .filter((ele) =>
          appId ? ele.applicationId?.toString().includes(appId) : ele
        )
        .filter((ele) =>
          appType.length > 0 ? ele?.applicationType?.includes(appType) : ele
        )
        .filter((ele) =>
          actionType.length > 0 ? ele?.actionType?.includes(actionType) : ele
        )
        .filter(
          (ele) =>
            (from &&
              dayjs(ele.creationTimestamp).format("YYYY-MM-DD") ===
                dayjs(from).format("YYYY-MM-DD")) ||
            (to &&
              dayjs(ele.creationTimestamp).format("YYYY-MM-DD") ===
                dayjs(to).format("YYYY-MM-DD")) ||
            (from &&
              to &&
              dayjs(from).format("YYYY-MM-DD") <=
                dayjs(ele?.creationTimestamp).format("YYYY-MM-DD") &&
              dayjs(ele?.creationTimestamp).format("YYYY-MM-DD") <=
                dayjs(to).format("YYYY-MM-DD")) ||
            (!from && !to && ele)
        );
    };
    // console.log(filteredData()?.length);
    filterDispatch({ type: "filteredData", payload: filteredData() });
  };

  return (
    <Box sx={{ width: "100%" }}>
      {loading ? (
        <Box
          sx={{ width: "100%", m: 2 }}
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
          <div>
            <Typography p={2}>Please wait...</Typography>
          </div>
        </Box>
      ) : (
        <Box sx={{ m: 2 }}>
          <Paper sx={{ p: 2 }}>
            <TextField
              style={{ margin: 10, minWidth: 150 }}
              label="Log Id"
              value={logId}
              variant="outlined"
              onChange={(e) => {
                // setLogId(e.target.value);
                stateDispatch({ type: "logId", payload: e.target.value });
              }}
            />

            <TextField
              value={appId}
              style={{ margin: 10, minWidth: 150 }}
              label="Application Id"
              variant="outlined"
              onChange={(e) => {
                // setAppId(e.target.value);
                stateDispatch({ type: "appId", payload: e.target.value });
              }}
            />

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Application Type</InputLabel>
              <Select
                value={appType}
                label="Application Type"
                onChange={(e) => {
                  // setAppType(e.target.value);
                  stateDispatch({ type: "appType", payload: e.target.value });
                }}
              >
                <MenuItem value="" disabled>
                  Please select
                </MenuItem>
                {applicationTypeList?.map((ele, i) => {
                  return (
                    <MenuItem key={i} value={ele}>
                      {ele}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={actionType}
                label="Action Type"
                onChange={(e) => {
                  // setActionType(e.target.value);
                  stateDispatch({
                    type: "actionType",
                    payload: e.target.value,
                  });
                }}
              >
                <MenuItem value="" disabled>
                  Please select
                </MenuItem>
                {actionTypeList?.map((ele, i) => {
                  return (
                    <MenuItem key={i} value={ele}>
                      {ele}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <DatePickup
                lable={"From Date"}
                val={from}
                // setVal={setFrom}
                setVal={(val) => stateDispatch({ type: "from", payload: val })}
                // searchParam={searchParam}
                // setsearchParam={setsearchParam}
                to={to}
              />
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <DatePickup
                lable={"To Date"}
                // searchParam={searchParam}
                // setsearchParam={setsearchParam}
                val={to}
                // setVal={setTo}
                setVal={(val) => stateDispatch({ type: "to", payload: val })}
                from={from}
              />
            </FormControl>

            <FormControl sx={{ m: 2 }}>
              <Button variant="outlined" onClick={applyFilter}>
                Search Logger
              </Button>
            </FormControl>
          </Paper>

          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
              />

              <TableBody>
                {dataFilter.length > 0 ? (
                  dataFilter
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ele, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {ele.logId ? ele.logId : `--`}
                          </TableCell>
                          <TableCell align="center">
                            {ele.applicationId ? ele.applicationId : `--`}
                          </TableCell>
                          <TableCell align="center">
                            {ele.applicationType ? ele.applicationType : `--`}
                          </TableCell>
                          <TableCell align="center">
                            {ele.actionType ? ele.actionType : `--`}
                          </TableCell>
                          <TableCell align="center">
                            {ele.creationTimestamp
                              ? ele.creationTimestamp
                              : `--`}
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={5}>
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {dataFilter.length !== 0 && (
            <TablePagination
              component="div"
              count={dataFilter.length}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
              onPageChange={handleChangePage}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
