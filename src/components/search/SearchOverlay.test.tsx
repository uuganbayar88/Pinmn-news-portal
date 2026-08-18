import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchOverlay from "./SearchOverlay";

describe("SearchOverlay", () => {
  it("shows all 8 archive rows with no query and filters as the user types", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={() => {}} onOpen={() => {}} toast={vi.fn()} />);
    expect(screen.getAllByText(/08\.0\d/).length).toBeGreaterThanOrEqual(8);
    await user.type(screen.getByPlaceholderText(/Хайх/), "метро");
    expect(screen.getByText(/метроны төслийн явц/)).toBeInTheDocument();
    expect(screen.queryByText("Төв банк бодлогын хүүг хэвээр хадгалав")).not.toBeInTheDocument();
  });

  it("shows the empty state for a miss", async () => {
    const user = userEvent.setup();
    render(<SearchOverlay open onClose={() => {}} onOpen={() => {}} toast={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/Хайх/), "zzz");
    expect(screen.getByText(/илэрц олдсонгүй/)).toBeInTheDocument();
  });
});
