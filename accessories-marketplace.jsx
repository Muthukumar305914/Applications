import { useState } from "react";

const USERS = {
  admin: { name: "System Admin", role: "admin", avatar: "👨‍💼" },
  guest: { name: "Guest User", role: "user", avatar: "👤" },
};

const CATEGORIES = ["All", "Tempered Glass", "Battery", "Bluetooth Speaker", "Charger", "Case & Cover", "Earphones"];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Premium Tempered Glass", brand: "ScreenShield", category: "Tempered Glass", price: 999, available: true, status: "published", emoji: "🛡️", imageData: null, desc: "9H hardness, anti-scratch, full coverage for iPhone 15 / Samsung S24" },
  { id: 2, name: "5000mAh Replacement Battery", brand: "PowerCell", category: "Battery", price: 2899, available: true, status: "published", emoji: "🔋", imageData: null, desc: "High-capacity Li-ion battery, compatible with Samsung Galaxy A series" },
  { id: 3, name: "Portable Bluetooth Speaker", brand: "SoundWave", category: "Bluetooth Speaker", price: 3999, available: true, status: "published", emoji: "🔊", imageData: null, desc: "360° surround sound, IPX5 waterproof, 12hr battery life" },
  { id: 4, name: "65W GaN Fast Charger", brand: "VoltMax", category: "Charger", price: 2299, available: false, status: "published", emoji: "⚡", imageData: null, desc: "USB-C PD 3.0, foldable plug, supports iPhone, Android & laptops" },
  { id: 5, name: "Shockproof Armour Case", brand: "ArmorGuard", category: "Case & Cover", price: 1499, available: true, status: "published", emoji: "📱", imageData: null, desc: "Military-grade drop protection, raised bezels, MagSafe compatible" },
  { id: 6, name: "Wireless Earbuds Pro", brand: "AudioPeak", category: "Earphones", price: 4999, available: true, status: "published", emoji: "🎧", imageData: null, desc: "Active noise cancellation, 30hr total battery, Bluetooth 5.3" },
  { id: 7, name: "Mini Bluetooth Speaker", brand: "SoundWave", category: "Bluetooth Speaker", price: 2499, available: true, status: "pending", emoji: "📻", imageData: null, desc: "Ultra-compact, RGB lighting, USB-C charging, 8hr playtime" },
  { id: 8, name: "Privacy Tempered Glass", brand: "ScreenShield", category: "Tempered Glass", price: 1299, available: false, status: "pending", emoji: "🕶️", imageData: null, desc: "Anti-spy screen protector, 28° privacy angle, for iPhone 14/15" },
];

const CATEGORY_COLORS = {
  "Tempered Glass":    { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Battery":           { bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
  "Bluetooth Speaker": { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "Charger":           { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  "Case & Cover":      { bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
  "Earphones":         { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
};

const formatINR = (amount) => "₹" + Number(amount).toLocaleString("en-IN");

let nextId = 9;

export default function App() {
  const [currentUser, setCurrentUser] = useState("guest");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [filterCat, setFilterCat] = useState("All");
  const [filterAvail, setFilterAvail] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const user = USERS[currentUser];
  const isAdmin = user.role === "admin";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const publish = (id) => { setProducts(p => p.map(x => x.id === id ? { ...x, status: "published" } : x)); showToast("✅ Product published — now visible to all users"); };
  const unpublish = (id) => { setProducts(p => p.map(x => x.id === id ? { ...x, status: "pending" } : x)); showToast("⏳ Product moved back to pending", "warn"); };
  const deleteProduct = (id) => { setProducts(p => p.filter(x => x.id !== id)); showToast("🗑️ Product deleted", "warn"); };
  const addProduct = (product) => { setProducts(p => [...p, { ...product, id: nextId++, status: "pending" }]); setShowAddModal(false); showToast("⏳ Product added — awaiting admin approval", "info"); };

  const pendingCount = products.filter(p => p.status === "pending").length;

  const visibleProducts = products.filter(p => {
    if (!isAdmin && p.status !== "published") return false;
    if (isAdmin && activeTab === "pending" && p.status !== "pending") return false;
    if (filterCat !== "All" && p.category !== filterCat) return false;
    if (filterAvail === "In Stock" && !p.available) return false;
    if (filterAvail === "Out of Stock" && p.available) return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase()) && !p.brand.toLowerCase().includes(searchQ.toLowerCase()) && !p.category.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f3f4f8", color: "#1a1a2e" }}>
      {toast && (
        <div style={{ position: "fixed", top: 18, right: 18, zIndex: 9999, background: toast.type === "success" ? "#065f46" : toast.type === "warn" ? "#92400e" : "#1e3a8a", color: "#fff", borderRadius: 12, padding: "12px 20px", fontSize: 13, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", animation: "slideIn 0.25s ease", fontWeight: 600 }}>{toast.msg}</div>
      )}

      {/* Nav */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "0 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🎒</span>
            <div>
              <span style={{ fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>AccessoryHub</span>
              <span style={{ fontSize: 11, color: "#64748b", display: "block", lineHeight: 1 }}>Mobile Accessories Store</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, background: "rgba(255,255,255,0.07)", borderRadius: 30, padding: 4 }}>
            {Object.entries(USERS).map(([key, u]) => (
              <button key={key} onClick={() => { setCurrentUser(key); setActiveTab("all"); }} style={{ padding: "6px 16px", borderRadius: 24, border: "none", cursor: "pointer", background: currentUser === key ? "#f97316" : "transparent", color: currentUser === key ? "#fff" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}>{u.avatar} {u.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Role Banner */}
      <div style={{ background: isAdmin ? "#fffbeb" : "#f0f9ff", borderBottom: `3px solid ${isAdmin ? "#f59e0b" : "#38bdf8"}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <span style={{ background: isAdmin ? "#f59e0b" : "#0ea5e9", color: "#fff", borderRadius: 20, padding: "2px 12px", fontWeight: 800, fontSize: 11 }}>{isAdmin ? "🔐 ADMIN" : "👤 USER"}</span>
            <span style={{ color: "#64748b" }}>{isAdmin ? `Managing all products — ${pendingCount} pending approval.` : `Viewing published products only. New items appear after admin approval.`}</span>
          </div>
          {isAdmin && <button onClick={() => setShowAddModal(true)} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>＋ Add Accessory</button>}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        {isAdmin && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["all", "📦 All Products"], ["pending", `⏳ Pending Approval${pendingCount > 0 ? ` (${pendingCount})` : ""}`]].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: 10, border: "2px solid", borderColor: activeTab === tab ? "#f97316" : "#e2e8f0", background: activeTab === tab ? "#fff7ed" : "#fff", color: activeTab === tab ? "#ea580c" : "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{label}</button>
            ))}
          </div>
        )}

        {/* Search + Filters */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="🔍  Search accessories, brands, categories..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box", background: "#f8fafc", fontFamily: "inherit" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>CATEGORY</span>
              {CATEGORIES.map(c => <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "4px 13px", borderRadius: 20, border: "1.5px solid", borderColor: filterCat === c ? "#0f172a" : "#e2e8f0", background: filterCat === c ? "#0f172a" : "#fff", color: filterCat === c ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{c}</button>)}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>STOCK</span>
              {["All","In Stock","Out of Stock"].map(a => <button key={a} onClick={() => setFilterAvail(a)} style={{ padding: "4px 13px", borderRadius: 20, border: "1.5px solid", borderColor: filterAvail === a ? "#16a34a" : "#e2e8f0", background: filterAvail === a ? "#16a34a" : "#fff", color: filterAvail === a ? "#fff" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{a}</button>)}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>Showing <strong style={{ color: "#1a1a2e" }}>{visibleProducts.length}</strong> {isAdmin ? "product(s)" : "published product(s)"}</span>
          {!isAdmin && pendingCount > 0 && <span style={{ background: "#fef3c7", color: "#92400e", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>⏳ {pendingCount} awaiting approval — not visible to you</span>}
        </div>

        {visibleProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8" }}>No products found</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
            {visibleProducts.map(p => <ProductCard key={p.id} product={p} isAdmin={isAdmin} onPublish={publish} onUnpublish={unpublish} onDelete={deleteProduct} />)}
          </div>
        )}
      </div>

      {showAddModal && <AddModal onAdd={addProduct} onClose={() => setShowAddModal(false)} />}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function ProductCard({ product, isAdmin, onPublish, onUnpublish, onDelete }) {
  const isPending = product.status === "pending";
  const cat = CATEGORY_COLORS[product.category] || { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: isPending ? "0 0 0 2px #f59e0b,0 4px 18px rgba(0,0,0,0.07)" : "0 4px 18px rgba(0,0,0,0.07)", transition: "transform 0.18s", animation: "fadeUp 0.3s ease", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ height: 140, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative", overflow: "hidden" }}>
        {product.imageData
          ? <img src={product.imageData} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          : product.emoji}
        {isAdmin && <div style={{ position: "absolute", top: 10, left: 10, background: isPending ? "#f59e0b" : "#10b981", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 800 }}>{isPending ? "⏳ Pending" : "✅ Published"}</div>}
        {!product.available && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: "#ef4444", color: "#fff", borderRadius: 8, padding: "5px 14px", fontWeight: 800, fontSize: 12, letterSpacing: 1 }}>OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ alignSelf: "flex-start", background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>{product.category}</span>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{product.brand}</div>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{product.desc}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a" }}>{formatINR(product.price)}</div>
          <div style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", background: product.available ? "#f0fdf4" : "#fef2f2", color: product.available ? "#16a34a" : "#ef4444", border: `1px solid ${product.available ? "#bbf7d0" : "#fecaca"}` }}>{product.available ? "✓ In Stock" : "✕ Out of Stock"}</div>
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
            {isPending
              ? <button onClick={() => onPublish(product.id)} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Publish →</button>
              : <button onClick={() => onUnpublish(product.id)} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#94a3b8", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Unpublish</button>
            }
            <button onClick={() => onDelete(product.id)} style={{ padding: "8px 12px", borderRadius: 9, border: "1.5px solid #fee2e2", background: "#fff", color: "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🗑️</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", brand: "", category: "Tempered Glass", price: "", available: true, desc: "", emoji: "📦", imageData: null, imageName: "" });
  const [dragOver, setDragOver] = useState(false);
  const [imgError, setImgError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim() && Number(form.price) > 0 && form.brand.trim();
  const EMOJIS = ["📦","🛡️","🔋","🔊","⚡","📱","🎧","🖥️","🔌","💡","🧲","📻"];
  const ALLOWED = ["image/jpeg","image/png","image/webp","image/gif"];

  const handleFile = (file) => {
    setImgError("");
    if (!file) return;
    if (!ALLOWED.includes(file.type)) { setImgError("Only JPG, PNG, WEBP or GIF allowed."); return; }
    if (file.size > 5 * 1024 * 1024) { setImgError("Max file size is 5MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => { set("imageData", e.target.result); set("imageName", file.name); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 500, boxShadow: "0 24px 60px rgba(0,0,0,0.25)", animation: "fadeUp 0.25s ease", maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>➕ Add New Accessory</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Image Upload */}
          <Field label="Product Image (optional)">
            {form.imageData ? (
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "2px solid #e2e8f0" }}>
                <img src={form.imageData} alt="preview" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <label style={{ padding: "8px 16px", borderRadius: 9, background: "#fff", color: "#0f172a", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                    🔄 Replace <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
                  </label>
                  <button onClick={() => { set("imageData", null); set("imageName", ""); }} style={{ padding: "8px 16px", borderRadius: 9, background: "#ef4444", color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🗑️ Remove</button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(15,23,42,0.7)", padding: "5px 12px", fontSize: 11, color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🖼️</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.imageName}</span>
                  <span style={{ marginLeft: "auto", background: "#10b981", borderRadius: 20, padding: "1px 8px", color: "#fff", fontWeight: 700 }}>✓ Uploaded</span>
                </div>
              </div>
            ) : (
              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                style={{ border: `2px dashed ${dragOver ? "#f97316" : "#cbd5e1"}`, borderRadius: 12, background: dragOver ? "#fff7ed" : "#f8fafc", padding: "32px 20px", textAlign: "center", transition: "all 0.2s" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 4 }}>{dragOver ? "Drop image here!" : "Drag & drop a product image"}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>JPG, PNG, WEBP, GIF — max 5MB</div>
                <label style={{ display: "inline-block", padding: "8px 20px", borderRadius: 10, background: "#f97316", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Browse File <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
                </label>
              </div>
            )}
            {imgError && <div style={{ marginTop: 6, fontSize: 12, color: "#ef4444", fontWeight: 600 }}>⚠️ {imgError}</div>}
          </Field>

          <Field label="Product Name *">
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Premium Tempered Glass Pro" style={inputStyle} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Brand *">
              <input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="e.g. ScreenShield" style={inputStyle} />
            </Field>
            <Field label="Price (INR) *">
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#374151", fontWeight: 800, pointerEvents: "none" }}>₹</span>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="999" style={{ ...inputStyle, paddingLeft: 26 }} min={0} step="1" />
              </div>
            </Field>
          </div>

          <Field label="Category">
            <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Description">
            <input value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Short product description..." style={inputStyle} />
          </Field>

          {!form.imageData && (
            <Field label="Icon (used when no image uploaded)">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {EMOJIS.map(em => <button key={em} onClick={() => set("emoji", em)} style={{ fontSize: 22, padding: "6px", borderRadius: 9, cursor: "pointer", border: "2px solid", borderColor: form.emoji === em ? "#f97316" : "#e2e8f0", background: form.emoji === em ? "#fff7ed" : "#fff" }}>{em}</button>)}
              </div>
            </Field>
          )}

          <Field label="Availability">
            <div style={{ display: "flex", gap: 8 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => set("available", v)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "2px solid", cursor: "pointer", borderColor: form.available === v ? (v ? "#16a34a" : "#ef4444") : "#e2e8f0", background: form.available === v ? (v ? "#f0fdf4" : "#fef2f2") : "#fff", color: form.available === v ? (v ? "#16a34a" : "#ef4444") : "#94a3b8", fontWeight: 700, fontSize: 13 }}>{v ? "✓ In Stock" : "✕ Out of Stock"}</button>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ marginTop: 16, padding: "10px 14px", background: "#fffbeb", borderRadius: 10, border: "1px solid #fde68a", fontSize: 12, color: "#92400e" }}>
          ⏳ This product will be saved as <strong>Pending</strong> and must be published by an admin before users can see it.
        </div>

        <button onClick={() => valid && onAdd({ ...form, price: parseInt(form.price, 10) })} style={{ marginTop: 14, width: "100%", padding: "13px", borderRadius: 12, border: "none", background: valid ? "#f97316" : "#e2e8f0", color: valid ? "#fff" : "#94a3b8", fontWeight: 900, fontSize: 15, cursor: valid ? "pointer" : "not-allowed", transition: "background 0.2s" }}>
          Add Accessory
        </button>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#f8fafc" };

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}
