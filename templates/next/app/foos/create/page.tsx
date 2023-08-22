"use client";

import type { Metadata } from "next";
import { Form } from "../../../components/{{{lc}}}/Form";

export const metadata: Metadata = {
  title: "Create {{{ucf}}}",
};

export default function Page() {
  return (
    <div>
      <Form />
    </div>
  );
}
