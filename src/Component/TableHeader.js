import { TableHead, TableSortLabel } from "@mui/material";
import TableCell from "@mui/material/TableCell";

import TableRow from "@mui/material/TableRow";

const headCells = [
  {
    id: "logId",
    label: "Log Id",
  },
  {
    id: "applicationId",
    label: "Application Id",
  },
  {
    id: "applicationType",
    label: "Application Type",
  },
  {
    id: "actionType",
    label: "Action Type",
  },
  {
    id: "creationTimestamp",
    label: "Date",
  },
];

export function TableHeader(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
      }
    : (a, b) => {
        if (b[orderBy] > a[orderBy]) return -1;
        if (b[orderBy] < a[orderBy]) return 1;
        return 0;
      };
}
