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
  if (orderBy === "applicationType") {
    return (a, b) => {
      if (a.applicationType < b.applicationType)
        return order === "asc" ? -1 : 1;
      if (a.applicationType === null) return order === "asc" ? -1 : 1;
      return order === "asc" ? 1 : -1;
    };
  } else {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
