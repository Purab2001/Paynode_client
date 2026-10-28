import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ChipGroup } from "@/components/ui/Field";
import { TableWrap, Td, Th } from "@/components/ui/Table";

describe("TableWrap (phone layout)", () => {
  const renderTable = (extraRow = null) =>
    render(
      <TableWrap caption="People">
        <thead>
          <tr>
            <Th>Person</Th>
            <Th align="right">Salary</Th>
            <Th align="right"><span className="sr-only">Actions</span></Th>
          </tr>
        </thead>
        <tbody>
          <tr><Td>Nadia</Td><Td>$3,200</Td><Td><button>Edit</button></Td></tr>
          {extraRow}
        </tbody>
      </TableWrap>,
    );

  it("labels each cell with its column so rows can stack into cards", async () => {
    renderTable();
    const cells = screen.getAllByRole("cell");
    await waitFor(() => expect(cells[1]).toHaveAttribute("data-label", "Salary"));
    expect(cells[0]).not.toHaveAttribute("data-label"); // the first cell is the row title
  });

  it("leaves screen-reader-only headers (row actions) without a visible label", async () => {
    renderTable();
    const cells = screen.getAllByRole("cell");
    await waitFor(() => expect(cells[1]).toHaveAttribute("data-label"));
    expect(cells[2]).not.toHaveAttribute("data-label");
  });

  it("skips full-width rows such as empty and error states", async () => {
    renderTable(<tr><Td colSpan={3}>No people</Td></tr>);
    await waitFor(() => expect(screen.getAllByRole("cell")[1]).toHaveAttribute("data-label"));
    expect(screen.getByText("No people")).not.toHaveAttribute("data-label");
  });
});

describe("ChipGroup", () => {
  it("marks the selected chip with the brand fill, which stays visible in dark mode", () => {
    render(<ChipGroup label="Filter" value="a" onChange={() => {}} items={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />);
    expect(screen.getByRole("button", { name: "A" })).toHaveClass("bg-brand");
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "B" })).not.toHaveClass("bg-brand");
  });
});
