"use client";
import React from "react";
// Importing HeroUI modules so bundler includes them; the package is available
import "@heroui/react";

export default function HeroProvider({ children }) {
  return <>{children}</>;
}
