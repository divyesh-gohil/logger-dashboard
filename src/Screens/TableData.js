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
    let filteredData = [];
    filteredData = resp.filter((el) => {
      return (
        el.logId == logId ||
        el.applicationId == appId ||
        el.applicationType == appType ||
        el.actionType == actionType ||
        (from &&
          !to &&
          dayjs(from).format("YYYY-MM-DD") ==
            dayjs(el.creationTimestamp).format("YYYY-MM-DD")) ||
        (to &&
          !from &&
          dayjs(to).format("YYYY-MM-DD") ==
            dayjs(el.creationTimestamp).format("YYYY-MM-DD")) ||
        (from &&
          to &&
          dayjs(from).format("YYYY-MM-DD") <=
            dayjs(el.creationTimestamp).format("YYYY-MM-DD") &&
          dayjs(to).format("YYYY-MM-DD") >=
            dayjs(el.creationTimestamp).format("YYYY-MM-DD"))
      );
    });
    setFilteredData(filteredData);
  };

  // useEffect(() => {
  //   applyFilter();
  // }, [logId, appId, appType, actionType, from, to]);

  useEffect(() => {
    const callAPI = async () => {
      await setLoading(true);
      let resp = await getTableData();
      await setResp(resp?.data?.result?.auditLog);
      await setLoading(false);
    };
    callAPI();
  }, []);

  useEffect(() => {
    const logIdParam = searchParam?.get("logId");
    const appIdParam = searchParam.get("appId");
    const appTypeParam = searchParam.get("appType");
    const actionTypeParam = searchParam.get("actionType");
    const fromParam = searchParam.get("from");
    const toParam = searchParam.get("to");

    setLogId(logIdParam ? logIdParam : "");
    setAppId(appIdParam ? appIdParam : "");
    setAppType(appTypeParam ? appTypeParam : "");
    setActionType(actionTypeParam ? actionTypeParam : "");
    setFrom(fromParam ? fromParam : "");
    setTo(toParam ? toParam : "");
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
              type="number"
              style={{ margin: 10, minWidth: 150 }}
              label="Log Id"
              value={logId}
              variant="outlined"
              onChange={(e) => {
                searchParam.set("logId", e.target.value);
                setsearchParam(searchParam);
              }}
              InputProps={
                logId && {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => {
                        // setLogId("")
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
              type={"number"}
              value={appId}
              style={{ margin: 10, minWidth: 150 }}
              label="Application Id"
              variant="outlined"
              onChange={(e) => {
                searchParam.set("appId", e.target.value);
                setsearchParam(searchParam);
              }}
              InputProps={
                appId && {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => {
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
              <InputLabel id="demo-simple-select-readonly-label">
                Application Type
              </InputLabel>
              <Select
                value={appType}
                label="Application Type"
                onChange={(e) => {
                  searchParam.set("appType", e.target.value);
                  setsearchParam(searchParam);
                }}
                endAdornment={
                  appType && (
                    <IconButton
                      onClick={() => {
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
              <InputLabel id="demo-simple-select-readonly-label">
                Action Type
              </InputLabel>
              <Select
                value={actionType}
                label="Action Type"
                onChange={(e) => {
                  searchParam.set("actionType", e.target.value);
                  setsearchParam(searchParam);
                }}
                endAdornment={
                  actionType && (
                    <IconButton
                      onClick={() => {
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
                searchParam={searchParam}
                setsearchParam={setsearchParam}
              />
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <DatePickup
                lable={"To Date"}
                searchParam={searchParam}
                setsearchParam={setsearchParam}
                val={to}
              />
            </FormControl>

            <FormControl sx={{ m: 2 }}>
              <Button variant="outlined" onClick={applyFilter}>
                Search Logger
              </Button>
            </FormControl>
            {/* <FormControl sx={{ m: 2 }}>
            <Button
              variant="outlined"
              onClick={clearFilter}
              disabled={
                !logId && !appId && !appType && !actionType && !from && !to
              }
            >
              Clear Filters
            </Button>
          </FormControl> */}
          </Paper>

          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHeader
                // headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
              />
              <TableBody>
                {filteredArray.length > 0
                  ? filteredArray
                      .sort(getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
                  : resp
                      .sort(getComparator(order, orderBy))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
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
                      })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={
              filteredArray.length > 0 ? filteredArray.length : resp.length
            }
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            onPageChange={handleChangePage}
            // onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
}
