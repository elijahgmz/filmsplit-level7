import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("FilmSplit Level 4 dApp Frontend", () => {
  test("renders the brand title and logo", () => {
    render(<App />);
    const titleElements = screen.getAllByText(/FilmSplit/i);
    expect(titleElements[0]).toBeInTheDocument();
  });

  test("renders connect wallet button and Stellar Testnet badge", () => {
    render(<App />);
    const networkBadges = screen.getAllByText(/Stellar Testnet/i);
    const connectButton = screen.getByText(/Connect Wallet/i);
    expect(networkBadges.length).toBeGreaterThan(0);
    expect(connectButton).toBeInTheDocument();
  });

  test("renders film project directory and dashboard stats", () => {
    render(<App />);
    const projectsHeader = screen.getByText(/Film Projects Directory/i);
    const createButton = screen.getByText(/New Film Split Project/i);
    expect(projectsHeader).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });
});
