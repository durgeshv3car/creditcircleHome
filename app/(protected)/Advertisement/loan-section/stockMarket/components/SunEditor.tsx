// ./SunEditor.tsx
"use client";

import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const defaultFonts = [
  "Arial",
  "Comic Sans MS",
  "Courier New",
  "Impact",
  "Georgia",
  "Tahoma",
  "Trebuchet MS",
  "Verdana",
];

const TextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const sortedFontOptions = [
    "Logical",
    "Salesforce Sans",
    "Garamond",
    "Sans-Serif",
    "Serif",
    "Times New Roman",
    "Helvetica",
    ...defaultFonts,
  ].sort();
  return (
    <SunEditor
      setContents={value}
      onChange={(content) => onChange(content)}
      height="200px"
      placeholder="Write description..."
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["font", "fontSize"],
          ["bold", "underline", "italic"],
          ["fontColor", "hiliteColor"],
          ["align", "list", "lineHeight"],
          ["outdent", "indent"],
          ["table", "horizontalRule"],
        ],
        font: sortedFontOptions,
      }}
    />
  );
};

export default TextEditor;
