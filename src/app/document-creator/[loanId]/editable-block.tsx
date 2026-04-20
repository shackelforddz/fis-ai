"use client";

import { memo, createElement } from "react";

export const EditableBlock = memo(
  function EditableBlock({
    as = "div",
    initialHtml,
    className,
    placeholder,
  }: {
    as?: "h2" | "h3" | "h4" | "p" | "div";
    initialHtml: string;
    className?: string;
    placeholder?: string;
  }) {
    return createElement(as, {
      contentEditable: true,
      suppressContentEditableWarning: true,
      "data-placeholder": placeholder,
      className,
      dangerouslySetInnerHTML: { __html: initialHtml },
    });
  },
  () => true,
);
