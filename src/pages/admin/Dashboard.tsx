import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchTeam,
  createMember,
  updateMember,
  deleteMember,
  uploadImage,
  clearToken,
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type TeamMember,
  type Department,
} from "@/lib/admin-api";

const IMG_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const imageModules = import.meta.glob("/src/collectives/*", { eager: true, import: "default" }) as Record<string, string>;
const IMAGE_MAP: Record<string, string> = {};
Object.entries(imageModules).forEach(([path, url]) => {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "").toLowerCase();
  IMAGE_MAP[name] = url;
});
const NAME_OVERRIDES: Record<string, string> = {
  "sheth yamani": "seth yamani",
  "sanskruti akare": "sanskruthi",
  "rimi gosh": "rimi",
  "mohd usaid ali khan": "mohd usaid",
  "mohammad ali": "mohd usaid",
  "mohammad anasuddin zaid": "mohs anas",
  "anshika srivastava": "anshika",
  "sri satya": "sri",
  "guru dutt": "guru",
  "anurag khushwaha": "anurag",
  "achintya gurba": "achintya gurba",
  "deepak sharma": "deepak sharma",
  "ram nath g k": "ramnath",
  "naveen k d": "naveen kumar",
  "raavula vaibhav": "vaibhav",
  "shailender": "shilendar",
  "sibijan": "sibi",
  "tamil selvan": "tamil",
  "saurav": "sourav",
  "sharfudeen": "sharfu",
  "yash": "yash1",
  "chirag arora": "chirag-arora",
};

function getLocalImage(name: string): string | undefined {
  const key = name.toLowerCase().trim();
  const override = NAME_OVERRIDES[key];
  if (override && IMAGE_MAP[override]) return IMAGE_MAP[override];
  if (IMAGE_MAP[key]) return IMAGE_MAP[key];
  const firstName = key.split(/\s+/)[0];
  if (IMAGE_MAP[firstName]) return IMAGE_MAP[firstName];
  const lastName = key.split(/\s+/).pop()!;
  if (IMAGE_MAP[lastName]) return IMAGE_MAP[lastName];
  const fuzzy = Object.keys(IMAGE_MAP).find(k => key.includes(k) || k.includes(key));
  if (fuzzy) return IMAGE_MAP[fuzzy];
  return undefined;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const FALLBACK_COLORS: Record<string, { c: string; lc: string }> = {
  web: { c: "#7B2FBE", lc: "#9D4EDD" },
  app: { c: "#7B2FBE", lc: "#9D4EDD" },
  cyber: { c: "#7B2FBE", lc: "#9D4EDD" },
  analytics: { c: "#7B2FBE", lc: "#9D4EDD" },
  graphic: { c: "#7B2FBE", lc: "#9D4EDD" },
  admin: { c: "#007BFF", lc: "#0056b3" },
};

// ── Modal wrapper ─────────────────────────────────────

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#12121a",
          border: "1px solid #1f1f2a",
          borderRadius: "20px",
          padding: "36px 32px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "1.15rem",
            color: "#fff",
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Member form ───────────────────────────────────────

function MemberForm({
  initial,
  departments,
  onSave,
  onCancel,
}: {
  initial?: TeamMember | null;
  departments: Department[];
  onSave: (data: {
    name: string;
    teamId: string;
    teamName: string;
    responsibilities: string[];
    imageFile?: File;
  }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [teamId, setTeamId] = useState(initial?.team_id || (departments[0]?.id || "web"));
  const [responsibilitiesStr, setResponsibilitiesStr] = useState(
    initial?.responsibilities?.join(", ") || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    initial?.image_url ? `${IMG_BASE}${initial.image_url}` : ""
  );
  const [saving, setSaving] = useState(false);

  const teamName = departments.find((t) => t.id === teamId)?.name || "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        teamId,
        teamName,
        responsibilities: responsibilitiesStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        imageFile: imageFile || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: 6,
          }}
        >
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
          onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: 6,
          }}
        >
          Team
        </label>
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          style={{
            ...inputStyle,
            cursor: "pointer",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
          onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
        >
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: 6,
          }}
        >
          Photo
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: preview
                ? "none"
                : "linear-gradient(135deg, #7B2FBEcc, #9D4EDD88)",
              border: "2px solid #1f1f2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
              transition: "border-color 0.2s",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.6rem",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                Add Photo
              </span>
            )}
          </div>
          <label
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              userSelect: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(123, 47, 190, 0.3)",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            Choose file
          </label>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label
          style={{
            display: "block",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: 6,
          }}
        >
          Responsibilities (comma separated)
        </label>
        <input
          value={responsibilitiesStr}
          onChange={(e) => setResponsibilitiesStr(e.target.value)}
          placeholder="e.g. Developer, Team Lead"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
          onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
        />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "12px 24px",
            background: "transparent",
            border: "1px solid #1f1f2a",
            borderRadius: "10px",
            color: "#9ca3af",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          style={{
            padding: "12px 28px",
            background: saving ? "#5a2d8a" : "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: saving || !name.trim() ? "not-allowed" : "pointer",
            opacity: saving || !name.trim() ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#0d0d15",
  border: "1px solid #1f1f2a",
  borderRadius: "10px",
  color: "#e4e4e7",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.85rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

// ── Member Card ───────────────────────────────────────

function MemberCard({
  member,
  color,
  lightColor,
  onEdit,
  onDelete,
}: {
  member: TeamMember;
  color: string;
  lightColor: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const imgUrl = member.image_url
    ? member.image_url.startsWith("http")
      ? member.image_url
      : `${IMG_BASE}${member.image_url}`
    : getLocalImage(member.name) || "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 20px 20px",
        background: "#12121a",
        border: "1px solid #1f1f2a",
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 40,
          background: `radial-gradient(ellipse at center, ${color}25, transparent 70%)`,
          filter: "blur(12px)",
          pointerEvents: "none",
        }}
      />

      {/* Action buttons */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 6,
          zIndex: 2,
        }}
      >
        <button
          onClick={onEdit}
          title="Edit"
          style={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid #1f1f2a",
            color: "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            transition: "background 0.2s",
          }}
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          style={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            color: "#ef4444",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            transition: "background 0.2s",
          }}
        >
          ✕
        </button>
      </div>

      {/* Avatar */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: imgUrl
              ? "none"
              : `linear-gradient(135deg, ${color}cc, ${lightColor}88)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${color}44`,
            boxShadow: `0 0 28px ${color}22`,
            overflow: "hidden",
          }}
        >
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={member.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              {getInitials(member.name)}
            </span>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${lightColor})`,
            border: "2.5px solid #0a0a0f",
          }}
        />
      </div>

      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "0.85rem",
          color: "#e4e4e7",
          textAlign: "center",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          marginBottom: 4,
        }}
      >
        {member.name}
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.6rem",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: lightColor,
          marginBottom: member.responsibilities?.length ? 10 : 0,
        }}
      >
        {member.team_name}
      </span>

      {member.responsibilities && member.responsibilities.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {member.responsibilities.map((r) => (
            <span
              key={r}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.55rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6b7280",
                background: "#0d0d15",
                border: "1px solid #1a1a25",
                borderRadius: "100px",
                padding: "2px 8px",
              }}
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────

export default function AdminDashboard() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const loadData = async () => {
    try {
      const [m, d] = await Promise.all([fetchTeam(), fetchDepartments()]);
      setMembers(m);
      setDepartments(d);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  function deptColor(id: string): string {
    return departments.find((d) => d.id === id)?.color || FALLBACK_COLORS[id]?.c || "#7B2FBE";
  }
  function deptLightColor(id: string): string {
    return departments.find((d) => d.id === id)?.light_color || FALLBACK_COLORS[id]?.lc || "#9D4EDD";
  }

  const handleSave = async (data: {
    name: string;
    teamId: string;
    teamName: string;
    responsibilities: string[];
    imageFile?: File;
  }) => {
    let imageUrl: string | undefined;
    if (data.imageFile) {
      imageUrl = await uploadImage(data.imageFile);
    }

    if (editingMember) {
      await updateMember(editingMember.id, {
        name: data.name,
        teamId: data.teamId,
        teamName: data.teamName,
        responsibilities: data.responsibilities,
        ...(imageUrl ? { imageUrl } : {}),
      });
      toast.success("Member updated");
    } else {
      await createMember({
        name: data.name,
        teamId: data.teamId,
        teamName: data.teamName,
        responsibilities: data.responsibilities,
        ...(imageUrl ? { imageUrl } : {}),
      });
      toast.success("Member added");
    }

    setEditingMember(null);
    setShowAddModal(false);
    loadData();
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    try {
      await deleteMember(deletingMember.id);
      toast.success("Member deleted");
      setDeletingMember(null);
      loadData();
    } catch {
      toast.error("Failed to delete member");
    }
  };

  const handleLogout = () => {
    clearToken();
    window.location.href = "/admin/login";
  };

  const handleSaveDept = async (data: {
    id: string;
    name: string;
    color: string;
    lightColor: string;
  }) => {
    if (editingDept) {
      await updateDepartment(editingDept.id, data);
      toast.success("Department updated");
    } else {
      await createDepartment(data);
      toast.success("Department created");
    }
    setEditingDept(null);
    setShowDeptModal(false);
    loadData();
  };

  const handleDeleteDept = async (id: string) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deleted");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Cannot delete department");
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0a0f",
        color: "#e4e4e7",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid #1f1f2a",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "1.15rem",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            BELVO
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#9D4EDD",
              padding: "3px 10px",
              background: "rgba(157,78,221,0.1)",
              border: "0.5px solid rgba(157,78,221,0.3)",
              borderRadius: "100px",
            }}
          >
            Admin
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.78rem",
              color: "#6b7280",
            }}
          >
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #1f1f2a",
              borderRadius: "8px",
              color: "#9ca3af",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Team Members
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.82rem",
                color: "#6b7280",
                marginTop: 4,
              }}
            >
              Manage the Belvo Collective
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowDeptModal(true)}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "1px solid #1f1f2a",
                borderRadius: "10px",
                color: "#9ca3af",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              Departments
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              + Add Member
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#6b7280",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Loading...
          </div>
        ) : members.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#6b7280",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                marginBottom: 8,
                color: "#9ca3af",
              }}
            >
              No team members yet
            </div>
            <div style={{ fontSize: "0.85rem" }}>
              Click "Add Member" to get started
            </div>
          </div>
        ) : (
          departments
            .filter((d) => members.some((m) => m.team_id === d.id))
            .map((dept) => {
              const teamMembers = members.filter((m) => m.team_id === dept.id);
              const c = dept.color;
              return (
                <div key={dept.id} style={{ marginBottom: 48 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 3,
                        height: 20,
                        background: `linear-gradient(180deg, ${c}, transparent)`,
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <h2
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "#fff",
                        margin: 0,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {dept.name}
                    </h2>
                    <div
                      style={{
                        height: 1,
                        flex: 1,
                        background: `linear-gradient(90deg, ${c}28, transparent)`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#6b7280",
                      }}
                    >
                      {teamMembers.length} member
                      {teamMembers.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {teamMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        color={dept.color}
                        lightColor={dept.light_color}
                        onEdit={() => setEditingMember(member)}
                        onDelete={() => setDeletingMember(member)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Add modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Team Member"
      >
        <MemberForm
          departments={departments}
          onSave={handleSave}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Team Member"
      >
        {editingMember && (
          <MemberForm
            departments={departments}
            initial={editingMember}
            onSave={handleSave}
            onCancel={() => setEditingMember(null)}
          />
        )}
      </Modal>

      {/* Delete modal */}
      <Modal
        open={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        title="Delete Member"
      >
        {deletingMember && (
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                color: "#9ca3af",
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "#e4e4e7" }}>
                {deletingMember.name}
              </strong>
              ? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeletingMember(null)}
                style={{
                  padding: "12px 24px",
                  background: "transparent",
                  border: "1px solid #1f1f2a",
                  borderRadius: "10px",
                  color: "#9ca3af",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #dc2626, #ef4444)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <DepartmentManager
        open={showDeptModal}
        departments={departments}
        editingDept={editingDept}
        onClose={() => { setShowDeptModal(false); setEditingDept(null); }}
        onSave={handleSaveDept}
        onEdit={(d) => setEditingDept(d)}
        onDelete={handleDeleteDept}
      />
    </div>
  );
}

// ── Department Manager ─────────────────────────────────

const PRESET_COLORS = [
  "#7B2FBE", "#9D4EDD", "#007BFF", "#0056b3",
  "#dc2626", "#ef4444", "#059669", "#10b981",
  "#d97706", "#f59e0b", "#0891b2", "#06b6d4",
  "#be123c", "#e11d48", "#4f46e5", "#6366f1",
  "#0d9488", "#14b8a6",
];

function DeptForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Department | null;
  onSave: (data: { id: string; name: string; color: string; lightColor: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [id, setId] = useState(initial?.id || "");
  const [color, setColor] = useState(initial?.color || "#7B2FBE");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !id.trim()) return;
    setSaving(true);
    try {
      await onSave({
        id: id.trim().toLowerCase().replace(/\s+/g, "-"),
        name: name.trim(),
        color,
        lightColor: color,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Department Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Video Editor"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
          onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Department ID</label>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. video-editor"
          required
          disabled={!!initial}
          style={{ ...inputStyle, opacity: initial ? 0.5 : 1 }}
          onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
          onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Color</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          {PRESET_COLORS.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: c,
                cursor: "pointer",
                border: color === c ? "3px solid #fff" : "2px solid transparent",
                boxShadow: color === c ? `0 0 12px ${c}66` : "none",
                transition: "all 0.15s",
                transform: color === c ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#hex"
            style={{ ...inputStyle, width: 120 }}
          />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#6b7280" }}>or type hex</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel} style={btnSec}>Cancel</button>
        <button type="submit" disabled={saving || !name.trim() || !id.trim()} style={btnPri}>
          {saving ? "Saving..." : initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

function DepartmentManager({
  open,
  departments,
  editingDept,
  onClose,
  onSave,
  onEdit,
  onDelete,
}: {
  open: boolean;
  departments: Department[];
  editingDept: Department | null;
  onClose: () => void;
  onSave: (data: { id: string; name: string; color: string; lightColor: string }) => Promise<void>;
  onEdit: (d: Department) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteErr, setDeleteErr] = useState("");

  useEffect(() => {
    if (!open) { setShowForm(false); setDeleting(null); setDeleteErr(""); }
  }, [open]);

  const handleDelete = async (id: string) => {
    setDeleteErr("");
    try {
      await onDelete(id);
      setDeleting(null);
    } catch (err: any) {
      setDeleteErr(err.message || "Cannot delete — still has members");
    }
  };

  const handleEdit = (d: Department) => {
    onEdit(d);
    setShowForm(true);
  };

  return (
    <Modal open={open} onClose={onClose} title="Manage Departments">
      <div>
        {(showForm || editingDept) ? (
          <div style={{ marginBottom: 24, padding: "20px", background: "#0d0d15", borderRadius: "14px", border: "1px solid #1f1f2a" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#e4e4e7", marginBottom: 16 }}>
              {editingDept ? "Edit Department" : "New Department"}
            </div>
            <DeptForm
              initial={editingDept}
              onSave={async (data) => {
                await onSave(data);
                setShowForm(false);
              }}
              onCancel={() => { setShowForm(false); onEdit(null as any); }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            style={{
              ...btnPri,
              marginBottom: 24,
              width: "100%",
              justifyContent: "center",
              display: "flex",
            }}
          >
            + New Department
          </button>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {departments.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
              No departments yet. Create one to get started.
            </div>
          )}
          {departments.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "#0d0d15",
                border: "1px solid #1f1f2a",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: d.color,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${d.color}44`,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#e4e4e7" }}>
                  {d.name}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "#6b7280" }}>
                  {d.id}
                </div>
              </div>
              <button
                onClick={() => handleEdit(d)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "1px solid #1f1f2a",
                  borderRadius: "8px",
                  color: "#9ca3af",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => { setDeleting(d.id); setDeleteErr(""); }}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "1px solid rgba(220,38,38,0.3)",
                  borderRadius: "8px",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                }}
              >
                Delete
              </button>

              {deleting === d.id && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                  onClick={() => setDeleting(null)}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: "#12121a",
                      border: "1px solid #1f1f2a",
                      borderRadius: "16px",
                      padding: "28px 32px",
                      maxWidth: 400,
                      width: "90%",
                    }}
                  >
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#fff", marginBottom: 12 }}>
                      Delete "{d.name}"?
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#9ca3af", marginBottom: 20, lineHeight: 1.6 }}>
                      This will permanently remove this department.
                    </p>
                    {deleteErr && (
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#ef4444", marginBottom: 16, padding: "8px 12px", background: "rgba(220,38,38,0.1)", borderRadius: "8px" }}>
                        {deleteErr}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button onClick={() => setDeleting(null)} style={btnSec}>Cancel</button>
                      <button onClick={() => handleDelete(d.id)} style={{ ...btnPri, background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ── Shared styles ──────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#9ca3af",
  marginBottom: 6,
};

const btnPri: React.CSSProperties = {
  padding: "12px 24px",
  background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  fontSize: "0.8rem",
  cursor: "pointer",
};

const btnSec: React.CSSProperties = {
  padding: "12px 24px",
  background: "transparent",
  border: "1px solid #1f1f2a",
  borderRadius: "10px",
  color: "#9ca3af",
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: "0.8rem",
  cursor: "pointer",
};
