import React from "react";
import SideStripe from "./SideStripe";
import StatusPill from "./StatusPill";
import getStatusStyle from "../../ui/getStatusStyle";

export default function AppointmentCard({
  time,
  title,
  subtitle,
  status,
  className = "",
  right,
}) {
  const styles = getStatusStyle(status);

  return (
    <li className={`relative bg-white border border-gray-100 rounded-2xl p-3 shadow-sm pl-7 ${className}`}>
      <SideStripe trackClass={styles.track} gradClass={styles.grad} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-900">{time}</div>
            {right ?? <StatusPill classes={styles} />}
          </div>

          <p className="mt-1 text-sm font-semibold text-gray-900">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </li>
  );
}
