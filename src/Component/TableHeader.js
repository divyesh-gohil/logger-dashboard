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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// export function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => {
        if (a[orderBy] === null) return 1;
        if (b[orderBy] === null) return -1;
        if (a[orderBy] === b[orderBy]) return 0;
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    : (a, b) => {
        if (a[orderBy] === null) return 1;
        if (b[orderBy] === null) return -1;
        if (a[orderBy] === b[orderBy]) return 0;
        return a[orderBy] < b[orderBy] ? -1 : 1;
      };
}
