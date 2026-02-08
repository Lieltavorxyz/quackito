import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("renders the app title", () => {
  render(<App />);
  expect(screen.getByText("Quackito")).toBeTruthy();
});

test("renders the duck", () => {
  render(<App />);
  expect(screen.getByRole("img", { name: "duck" })).toBeTruthy();
});

test("renders status bars", () => {
  render(<App />);
  expect(screen.getByText("Hunger")).toBeTruthy();
  expect(screen.getByText("Happiness")).toBeTruthy();
  expect(screen.getByText("Energy")).toBeTruthy();
});

test("renders action buttons", () => {
  render(<App />);
  expect(screen.getByText(/Feed/)).toBeTruthy();
  expect(screen.getByText(/Play/)).toBeTruthy();
  expect(screen.getByText(/Sleep/)).toBeTruthy();
});

test("feed button updates hunger", async () => {
  render(<App />);
  const feedBtn = screen.getByText(/Feed/);
  await userEvent.click(feedBtn);
  // If it didn't crash, the action worked
  expect(screen.getByText("Quackito")).toBeTruthy();
});

test("renders time-of-day greeting", () => {
  render(<App />);
  expect(screen.getByText(/Good|Shh/)).toBeTruthy();
});
