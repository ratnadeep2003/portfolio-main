"use client";

import dynamic from "next/dynamic";
import { NotionRenderer } from "react-notion-x";

// Core styles for react-notion-x
import "react-notion-x/src/styles.css";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
);

export default function NotionPage({ recordMap }: { recordMap: any }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode
      components={{ Code, Collection, Equation, Modal }}
      mapPageUrl={(pageId: string) => `/blog/${pageId.replace(/-/g, "")}`}
    />
  );
}