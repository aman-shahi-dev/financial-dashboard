import { Shield, Eye } from "lucide-react";
import { ROLES } from "../../utils/rbac";

export default function RoleBadge({ role }) {
  const isAdmin = role === ROLES.ADMIN;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
        background: "var(--color-accent-muted)",
        color: "#f97316",
        border: "0.5px solid rgba(124,111,247,0.25)",
      }}
    >
      {isAdmin ? <Shield size={12} /> : <Eye size={12} />}
      {isAdmin ? "Admin" : "Viewer"}
    </div>
  );
}
