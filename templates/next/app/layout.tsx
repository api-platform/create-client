import React from "react";
import type { Metadata } from "next";
import Wrapper from "../components/common/Wrapper";
import "../styles/style.css";

export const metadata: Metadata = {
  title: "API Platform Create Client",
  description:
    "Create REST and GraphQL APIs, scaffold Jamstack webapps, stream changes in real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
