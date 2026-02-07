import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the app title", () => {
  render(<App />);
  expect(screen.getByText("Quackito")).toBeTruthy();
});

test("renders the duck", () => {
  render(<App />);
  expect(screen.getByRole("img", { name: "duck" })).toBeTruthy();
});

test("renders action buttons", () => {
  render(<App />);
  expect(screen.getByText(/Feed/)).toBeTruthy();
  expect(screen.getByText(/Play/)).toBeTruthy();
  expect(screen.getByText(/Sleep/)).toBeTruthy();
});
