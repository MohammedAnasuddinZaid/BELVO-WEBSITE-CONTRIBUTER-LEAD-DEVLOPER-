import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ServiceItem } from "@/content/services";

interface ServiceDialogProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export default function ServiceDialog({ service, onClose }: ServiceDialogProps) {
  return (
    <Dialog open={!!service} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent style={{ maxWidth: "920px", width: "min(92vw, 920px)", maxHeight: "88vh", overflowY: "auto", borderRadius: "24px", padding: 0, border: "1px solid rgba(157,78,221,0.24)", background: "var(--belvo-bg-card)", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>
        {service && (
          <div style={{ padding: "28px 28px 32px" }}>
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.45rem", color: "var(--belvo-text-1)" }}>
                {service.title}
              </DialogTitle>
              <DialogDescription style={{ fontFamily: "'Inter',sans-serif", color: "var(--belvo-text-2)", lineHeight: 1.75 }}>
                {service.desc}
              </DialogDescription>
            </DialogHeader>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
              {service.keywords.map(keyword => (
                <span
                  key={keyword}
                  style={{ padding: "6px 12px", background: "rgba(157,78,221,0.08)", border: "1px solid rgba(157,78,221,0.15)", borderRadius: "8px", fontFamily: "'Inter',sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "rgba(157,78,221,0.82)", letterSpacing: "0.02em" }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
