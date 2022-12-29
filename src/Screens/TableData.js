/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import {
  createSearchParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { getTableData } from "../CallApi/GetTableData";
import { getComparator, TableHeader } from "../Component/TableHeader";
import DatePickup from "../Component/DatePickup";

export default function TableData() {
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [resp, setResp] = useState([]);
  const [filteredArray, setFilteredData] = useState([]);

  const [searchParam, setsearchParam] = useSearchParams();

  const [val, setVal] = useState({
    logId: "",
    appId: "",
    appType: "",
    actionType: "",
    from: "",
    to: "",
  });

  const { logId, appId, appType, actionType, from, to } = val;

  ////for Search
  // const [logId, setLogId] = useState("");
  // const [appType, setAppType] = useState("");
  // const [appId, setAppId] = useState("");
  // const [actionType, setActionType] = useState("");
  // const [from, setFrom] = useState("");
  // const [to, setTo] = useState("");

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

  const setupParams = useCallback(() => {
    let params = {};
    Object.assign(params, logId && { logId: logId });
    Object.assign(params, appId && { appId: appId });
    Object.assign(params, appType && { appType: appType });
    Object.assign(params, actionType && { actionType: actionType });
    Object.assign(params, from && { from: from });
    Object.assign(params, to && { to: to });
    setsearchParam(createSearchParams(params));
  }, [logId, appId, appType, actionType, from, to]);

  const filteredData = () => {
    const filterdata = resp
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
    console.log(filterdata);
    setFilteredData(filterdata);
  };

  const applyFilter = () => {
    setupParams();
    if (!logId && !appId && !appType & !actionType && !from && !to) {
      console.log("inside if");
      setFilteredData(resp);
    } else {
      console.log("inside else");
      filteredData();
      setPage(0);
    }
  };

  const callAPI = useCallback(async () => {
    setLoading(true);
    let resp = await getTableData();
    setResp(resp?.data?.result?.auditLog);
    setFilteredData(resp?.data?.result?.auditLog);
    setLoading(false);
  }, []);

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    setVal({
      ...val,
      logId: searchParam.get("logId") || "",
      appId: searchParam.get("appId") || "",
      appType: searchParam.get("appType") || "",
      actionType: searchParam.get("actionType") || "",
      from: searchParam.get("from") || "",
      to: searchParam.get("tto") || "",
    });
    filteredData();
  }, [searchParam]);

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
                setVal({ ...val, logId: e.target.value });
              }}
            />

            <TextField
              value={appId}
              style={{ margin: 10, minWidth: 150 }}
              label="Application Id"
              variant="outlined"
              onChange={(e) => {
                // setAppId(e.target.value);
                setVal({ ...val, appId: e.target.value });
              }}
            />

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Application Type</InputLabel>
              <Select
                value={appType}
                label="Application Type"
                onChange={(e) => {
                  // setAppType(e.target.value);
                  setVal({ ...val, appType: e.target.value });
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
                  setVal({ ...val, actionType: e.target.value });
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
                setVal={(e) => {
                  console.log(e);
                  setVal({ ...val, from: e });
                }}
                searchParam={searchParam}
                setsearchParam={setsearchParam}
                to={to}
              />
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <DatePickup
                lable={"To Date"}
                searchParam={searchParam}
                setsearchParam={setsearchParam}
                val={to}
                setVal={(e) => {
                  console.log(e);
                  setVal({ ...val, from: e });
                }}
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
                {filteredArray.length > 0 ? (
                  filteredArray
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

          {filteredArray.length !== 0 && (
            <TablePagination
              component="div"
              count={filteredArray.length}
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
