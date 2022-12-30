import { render, screen } from "@testing-library/react";
import TableData from "./TableData";
import * as myApi from "../CallApi/GetTableData";

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

describe("check", () => {
  test("renders learn react link", () => {
    beforeEach(() => {
      jest.spyOn(myApi, "getTableData").mockReturnValue(mockData);
    });
    render(<TableData />);
    screen.getByRole("hjdsgfjs");
  });
});
