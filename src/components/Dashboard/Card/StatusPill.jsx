import React from "react";

export default function StatusPill({ classes }) {
  const { pillBg, pillText, pillBorder, label } = classes;
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${pillBg} ${pillText} ${pillBorder}`}>
      {label}
    </span>
  );
}
