import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UiProvider from "@/components/ui/UiProvider";
import Quiz from "./Quiz";

describe("Quiz", () => {
  it("marks the correct answer and disables options after a wrong pick", async () => {
    const user = userEvent.setup();
    render(<UiProvider><Quiz /></UiProvider>);
    await user.click(screen.getByRole("button", { name: "Бууруулсан" }));
    expect(screen.getByRole("button", { name: "Хэвээр хадгалсан" })).toHaveAttribute("data-state", "ok");
    expect(screen.getByRole("button", { name: "Бууруулсан" })).toHaveAttribute("data-state", "no");
    expect(screen.getByRole("button", { name: "Нэмэгдүүлсэн" })).toBeDisabled();
  });

  it("marks only the picked correct answer as ok", async () => {
    const user = userEvent.setup();
    render(<UiProvider><Quiz /></UiProvider>);
    await user.click(screen.getByRole("button", { name: "Хэвээр хадгалсан" }));
    expect(screen.getByRole("button", { name: "Хэвээр хадгалсан" })).toHaveAttribute("data-state", "ok");
    expect(screen.getByRole("button", { name: "Бууруулсан" })).toHaveAttribute("data-state", "no");
  });
});
