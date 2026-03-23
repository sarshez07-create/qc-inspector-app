import { useState, useRef, useEffect } from "react";

// Konfigurasi Standar & Kategori
const EQUIPMENT_CATEGORIES = [
  { id: "piping", label: "Piping & Pipe Fittings", icon: "⚙️" },
  { id: "valve", label: "Valve", icon: "🔧" },
  { id: "vessel", label: "Pressure Vessel", icon: "🛢️" },
  { id: "tank", label: "Storage Tank", icon: "🏭" },
  { id: "pump", label: "Pump & Compressor", icon: "💧" },
  { id: "welding", label: "Welding & Joint", icon: "🔥" },
  { id: "structure", label: "Structural Steel", icon: "🏗️" },
  { id: "instrument", label: "Instrument & Electrical", icon: "📡" },
  { id: "coating", label: "Coating & Painting", icon: "🎨" },
  { id: "lifting", label: "Lifting & Rigging", icon: "🏋️" },
];

const INSPECTION_TYPES = [
  "Hydrotest / Pressure Test",
  "NDT (RT, UT, MT, PT, VT)",
  "Dimensional Check",
  "Material Verification (PMI)",
  "Welding Inspection (WPS/PQR)",
  "Visual Inspection",
  "Coating / Painting Inspection",
  "Leak Test / Pneumatic Test",
  "Mechanical Running Test",
  "Factory Acceptance Test (FAT)",
];

const QUICK_REFS = [
  {
    title: "Hydrotest — Piping (ASME B31.3)",
    tag: "ASME B31.3",
    color: "#00e5ff",
    content: "Test pressure = 1.5× design pressure. Hold time min. 10 menit. Fluid: air atau air bersih. Temperatur ≥ 10°C.",
  },
  {
    title: "Hydrotest — Pressure Vessel (ASME VIII Div.1)",
    tag: "ASME VIII",
    color: "#76ff03",
    content: "P_test = 1.3 × MAWP × (S_test/S_design). Hold ≥ 30 menit. UG-99 & UG-100.",
  },
  {
    title: "Hydrotest — Valve (API 598)",
    tag: "API 598",
    color: "#ff6d00",
    content: "Shell test: 1.5× CWP. Seat test: 1.1× CWP. Backseat test: 1.1× CWP. Durasi sesuai tabel API 598.",
  },
  {
    title: "Welding — Visual & Dimensional (AWS D1.1)",
    tag: "AWS D1.1",
    color: "#ea80fc",
    content: "Porosity, undercut, overlap, crack, crater. Acceptance criteria per Table 6.1 (statik) & Table 6.2 (siklik).",
  },
  {
    title: "Storage Tank (API 650)",
    tag: "API 650",
    content: "Water fill test, pengukuran settlement, vacuum box test las sudut, magnetic particle atau dye penetrant.",
    color: "#ffab40",
  },
];

// UI Component Utama
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages([...messages, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    // Simulasi respons jika API Key belum dipasang
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: `**Respon Simulasi:** Anda bertanya tentang "${userText}". Untuk mengaktifkan jawaban AI sungguhan, Anda perlu menghubungkan API Key Anthropic di bagian kode fetch.` 
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00e5ff">$1</strong>')
      .replace(/\n/g, "<br/>");
  };

  // Styles (Sama seperti script asli Anda)
  const styles = {
    app: { minHeight: "100vh", background: "#080f1a", color: "#c8d8e8", fontFamily: "sans-serif", display: "flex", flexDirection: "column" },
    header: { background: "#0a1628", borderBottom: "1px solid #1a3a5c", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 },
    title: { fontSize: 16, fontWeight: 700, color: "#e0f0ff", margin: 0 },
    tabs: { display: "flex", background: "#0a1628", borderBottom: "1px solid #1a3a5c" },
    tab: (active) => ({ padding: "12px", flex: 1, background: "none", border: "none", color: active ? "#00e5ff" : "#4a6a8a", borderBottom: active ? "2px solid #00e5ff" : "none", cursor: "pointer" }),
    chatArea: { flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 15 },
    msgBubble: (role) => ({ alignSelf: role === "user" ? "flex-end" : "flex-start", maxWidth: "80%", background: role === "user" ? "#0040a0" : "#0d1e2e", padding: "12px", borderRadius: "8px", fontSize: "14px" }),
    inputArea: { padding: "15px", background: "#0a1628", display: "flex", gap: 10 }
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={{fontSize: 24}}>🔍</div>
        <div>
          <p style={styles.title}>QC Inspector Standards AI</p>
          <small style={{color: "#5a8aaa"}}>Piping Inspector Tools</small>
        </div>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === "chat")} onClick={() => setActiveTab("chat")}>CHAT</button>
        <button style={styles.tab(activeTab === "quickref")} onClick={() => setActiveTab("quickref")}>QUICK REF</button>
      </div>

      <div style={{flex: 1, overflow: "hidden", display: "flex", flexDirection: "column"}}>
        {activeTab === "chat" ? (
          <>
            <div style={styles.chatArea}>
              {messages.map((m, i) => (
                <div key={i} style={styles.msgBubble(m.role)}>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                </div>
              ))}
              {loading && <div style={{color: "#00e5ff"}}>AI sedang berpikir...</div>}
              <div ref={chatEndRef} />
            </div>
            <div style={styles.inputArea}>
              <input 
                style={{flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #1a3a5c", background: "#0d1e30", color: "white"}}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tanya soal ASME, API, atau AWS..."
              />
              <button onClick={sendMessage} style={{padding: "10px 20px", background: "#00e5ff", border: "none", borderRadius: "5px", cursor: "pointer"}}>Kirim</button>
            </div>
          </>
        ) : (
          <div style={{padding: "20px", overflowY: "auto"}}>
            {QUICK_REFS.map((ref, i) => (
              <div key={i} style={{background: "#0d1e2e", padding: "15px", marginBottom: "10px", borderRadius: "8px", borderLeft: `4px solid ${ref.color}`}}>
                <strong style={{color: ref.color}}>{ref.tag}</strong>
                <p style={{margin: "5px 0", fontWeight: "bold"}}>{ref.title}</p>
                <small>{ref.content}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}