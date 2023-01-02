import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import { TableHeader } from "../Component/TableHeader";
import TableData from "./TableData";
import * as myApi from "../CallApi/GetTableData";

const columns = [
  {
    field: "logId",
    headerName: "Log Id",
  },
  {
    field: "applicationId",
    headerName: "Application Id",
  },
  {
    field: "applicationType",
    headerName: "Application Type",
  },
  {
    field: "actionType",
    headerName: "Action Type",
  },
  {
    field: "creationTimestamp",
    headerName: "Date",
  },
];

const mockData = {
  success: true,
  elapsed: 70,
  result: {
    totalPages: 392,
    number: 0,
    recordsTotal: 39103,
    recordsFiltered: 100,
    auditLog: [
      {
        logId: 906468196730134,
        applicationId: null,
        appkjdsiusoidlicationType: null,
        companyId: null,
        actionType: "DARI_REFRESH_TOKEN",
        ip: "10.11.0.89",
        userAgent:
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
        userId: 115678,
        source: null,
        ownerId: null,
        logInfo: null,
        creationTimestamp: "2022-01-31 17:29:00",
      },
    ],
  },
};

const load = true;
const notloading = false;

describe("Render TableData component", () => {
  test("Should render table heading", () => {
    render(
      <Router>
        <TableHeader />
      </Router>
    );
    columns.forEach(({ headerName }) => {
      expect(screen.getByText(headerName)).toBeInTheDocument();
    });
  });
  test("Should render column Heading value", () => {
    render(
      <Router>
        <TableHeader />
      </Router>
    );
    columns.forEach(({ headerName }) => {
      expect(screen.getByText(headerName)).toBeInTheDocument();
    });
  });

  test("Should render all search data field", () => {
    render(
      <Router>
        <TableData load={notloading} />
      </Router>
    );
    expect(screen.getByLabelText("Log Id")).toBeInTheDocument();
    expect(screen.getByLabelText("Application Id")).toBeInTheDocument();
    expect(screen.getByLabelText("From Date")).toBeInTheDocument();
    expect(screen.getByLabelText("To Date")).toBeInTheDocument();
    expect(screen.getByTestId("actionType")).toBeInTheDocument();
    expect(screen.getByTestId("appType")).toBeInTheDocument();
    expect(screen.getByText("Search Logger")).toBeInTheDocument();
  });
  test("Should render no data found text if data not found", () => {
    render(
      <Router>
        <TableData load={load} />
      </Router>
    );
    expect(screen.getByTestId("notloading")).toHaveTextContent(
      "No data found."
    );
  });

  test("renders api call ", () => {
    beforeEach(() => {
      jest.spyOn(myApi, "getTableData").mockReturnValue(mockData);
    });
    render(<TableData />);
    screen.getByRole("hjdsgfjs");
  });
});
