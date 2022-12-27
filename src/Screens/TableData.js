import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
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

  ////for Search
  const [logId, setLogId] = useState("");
  const [appType, setAppType] = useState("");
  const [appId, setAppId] = useState("");
  const [actionType, setActionType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

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

  const applyFilter = () => {
    logId ? searchParam.set("logId", logId) : searchParam.delete("logId");
    appId ? searchParam.set("appId", appId) : searchParam.delete("appId");
    appType
      ? searchParam.set("appType", appType)
      : searchParam.delete("appType");
    actionType
      ? searchParam.set("actionType", actionType)
      : searchParam.delete("actionType");
    from ? searchParam.set("from", from) : searchParam.delete("from");
    to ? searchParam.set("to", to) : searchParam.delete("to");
    setsearchParam(searchParam);
    setPage(0);

    if (!logId && !appId && !appType & !actionType && !from && !to) {
      setFilteredData(resp);
    } else {
      let filteredData = resp.filter((el) => {
        return (
          (logId &&
            el?.logId?.toString().trim()?.includes(logId?.toString())) ||
          (appId &&
            el?.applicationId?.toString()?.includes(appId.toString())) ||
          el?.applicationType?.toString() === appType?.toString() ||
          (el?.actionType != null &&
            el?.actionType?.toString() === actionType?.toString()) ||
          (from &&
            dayjs(el.creationTimestamp).format("YYYY-MM-DD") ===
              dayjs(from).format("YYYY-MM-DD")) ||
          (to &&
            dayjs(el.creationTimestamp).format("YYYY-MM-DD") ===
              dayjs(to).format("YYYY-MM-DD")) ||
          (from &&
            to &&
            dayjs(el.creationTimestamp).format("YYYY-MM-DD") <=
              dayjs(el.to).format("YYYY-MM-DD") &&
            dayjs(el.creationTimestamp).format("YYYY-MM-DD") >=
              dayjs(from).format("YYYY-MM-DD"))
        );
      });
      setFilteredData(filteredData);
    }
  };

  useEffect(() => {
    const callAPI = async () => {
      await setLoading(true);
      let resp = await getTableData();
      await setResp(resp?.data?.result?.auditLog);
      await setFilteredData(resp?.data?.result?.auditLog);
      await setLoading(false);
    };
    callAPI();
  }, []);

  useEffect(() => {
    window.onpopstate = (e) => {
      console.log("run");
      const logIdParam = searchParam.get("logId");
      const appIdParam = searchParam.get("appId");
      const appTypeParam = searchParam.get("appType");
      const actionTypeParam = searchParam.get("actionType");
      const fromParam = searchParam.get("from");
      const toParam = searchParam.get("to");

      logIdParam === null && setLogId("");
      appIdParam === null && setAppId("");
      appTypeParam == null && setAppType("");
      actionTypeParam === null && setActionType("");
      fromParam === null && setFrom("");
      toParam === null && setTo("");
    };
  }, []);

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
                setLogId(e.target.value);
              }}
              InputProps={
                logId && {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => {
                        setLogId("");
                        searchParam.delete("logId");
                        setsearchParam(searchParam);
                      }}
                    >
                      X
                    </InputAdornment>
                  ),
                }
              }
            />

            <TextField
              value={appId}
              style={{ margin: 10, minWidth: 150 }}
              label="Application Id"
              variant="outlined"
              onChange={(e) => {
                setAppId(e.target.value);
              }}
              InputProps={
                appId && {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => {
                        setAppId("");
                        searchParam.delete("appId");
                        setsearchParam(searchParam);
                      }}
                    >
                      X
                    </InputAdornment>
                  ),
                }
              }
            />

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel>Application Type</InputLabel>
              <Select
                value={appType}
                label="Application Type"
                onChange={(e) => {
                  setAppType(e.target.value);
                }}
                endAdornment={
                  appType && (
                    <IconButton
                      onClick={() => {
                        setAppType("");
                        searchParam.delete("appType");
                        setsearchParam(searchParam);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )
                }
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
                  setActionType(e.target.value);
                }}
                endAdornment={
                  actionType && (
                    <IconButton
                      onClick={() => {
                        setActionType("");
                        searchParam.delete("actionType");
                        setsearchParam(searchParam);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )
                }
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
                setVal={setFrom}
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
                setVal={setTo}
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
                            {ele.applicationId ? ele.applicationId : ``}
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

          {filteredArray.length != 0 && (
            <TablePagination
              component="div"
              count={filteredArray.length}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10]}
              onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
