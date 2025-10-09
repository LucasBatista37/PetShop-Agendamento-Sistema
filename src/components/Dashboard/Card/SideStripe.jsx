import React from "react";

export default function SideStripe({
  trackClass,
  gradClass,
  inset = { track: "left-2 top-2 bottom-2", core: "left-3 top-3 bottom-3" },
  widths = { track: "w-[12px]", core: "w-[6px]" },
}) {
  return (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute ${inset.track} ${widths.track} rounded-full ${trackClass}`}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute ${inset.core} ${widths.core} rounded-full bg-gradient-to-b ${gradClass} shadow-[0_0_0_1px_rgba(0,0,0,0.06)]`}
      />
    </>
  );
}
