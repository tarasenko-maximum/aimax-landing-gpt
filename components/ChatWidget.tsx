"use client";
import { useState } from "react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      <button onClick={() => setOpen(!open)}>AI Agent</button>
      {open && (
        <div style={{ marginTop: 8, padding: 12, background: "#111", borderRadius: 8 }}>
          AIMAX agent is running.
        </div>
      )}
    </div>
  );
}