import React, { useEffect, useState } from "react";
import API from "../services/api";

const Home = () => {
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState({ name: "", contactNumber: "", location: "" });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Predefined 10 major Indian cities
    const cities = [
        "Mumbai",
        "Delhi",
        "Bengaluru",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Ahmedabad",
        "Jaipur",
        "Lucknow",
    ];

    // Fetch vendors
    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await API.get("/vendors");
            setVendors(res.data);
        } catch (err) {
            console.error("Error fetching vendors:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    // Add or Update vendor
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/vendors/${editingId}`, form);
                setEditingId(null);
            } else {
                await API.post("/vendors", form);
            }
            setForm({ name: "", contactNumber: "", location: "" });
            fetchVendors();
        } catch (err) {
            console.error("Error saving vendor:", err);
        }
    };

    // Edit vendor
    const handleEdit = (vendor) => {
        setForm({ name: vendor.name, contactNumber: vendor.contactNumber, location: vendor.location });
        setEditingId(vendor._id);
    };

    // Delete vendor
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vendor?")) return;
        try {
            await API.delete(`/vendors/${id}`);
            fetchVendors();
        } catch (err) {
            console.error("Error deleting vendor:", err);
        }
    };

    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "'Inter', sans-serif",
                background: "linear-gradient(135deg, #f8fafc, #eef2f7)",
                minHeight: "100vh",
                color: "#333",
            }}
        >
            <h1 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "28px" }}>Vendor Management</h1>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                style={{
                    marginBottom: "25px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    background: "#fff",
                    padding: "15px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{
                        flex: "1",
                        padding: "10px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        outline: "none",
                        transition: "0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    required
                    style={{
                        flex: "1",
                        padding: "10px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        outline: "none",
                        transition: "0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />

                {/* Location dropdown */}
                <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    style={{
                        flex: "1",
                        padding: "10px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        outline: "none",
                        transition: "0.2s",
                        background: "#fff",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                >
                    <option value="" disabled>
                        Select Location
                    </option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    style={{
                        padding: "10px 18px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
                    onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}
                >
                    {editingId ? "Update Vendor" : "Add Vendor"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ name: "", contactNumber: "", location: "" });
                            setEditingId(null);
                        }}
                        style={{
                            padding: "10px 18px",
                            background: "#e2e8f0",
                            color: "#1e293b",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#cbd5e1")}
                        onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Vendor List */}
            <h2 style={{ marginBottom: "15px", color: "#334155", fontSize: "22px" }}>Vendors</h2>
            {loading ? (
                <p>Loading vendors...</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                >
                    <thead style={{ background: "#f1f5f9", textAlign: "left" }}>
                        <tr>
                            <th style={{ padding: "12px" }}>Name</th>
                            <th style={{ padding: "12px" }}>Contact</th>
                            <th style={{ padding: "12px" }}>Location</th>
                            <th style={{ padding: "12px" }}>Status</th>
                            <th style={{ padding: "12px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length > 0 ? (
                            vendors.map((v) => (
                                <tr key={v._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                    <td style={{ padding: "12px" }}>{v.name}</td>
                                    <td style={{ padding: "12px" }}>{v.contactNumber}</td>
                                    <td style={{ padding: "12px" }}>{v.location}</td>
                                    <td style={{ padding: "12px", color: v.status === "Inactive" ? "#ef4444" : "#16a34a" }}>
                                        {v.status}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        <button
                                            onClick={() => handleEdit(v)}
                                            style={{
                                                marginRight: "10px",
                                                padding: "6px 12px",
                                                border: "none",
                                                borderRadius: "6px",
                                                background: "#3b82f6",
                                                color: "#fff",
                                                cursor: "pointer",
                                                transition: "0.2s",
                                            }}
                                            onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
                                            onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(v._id)}
                                            style={{
                                                padding: "6px 12px",
                                                border: "none",
                                                borderRadius: "6px",
                                                background: "#f87171",
                                                color: "#fff",
                                                cursor: "pointer",
                                                transition: "0.2s",
                                            }}
                                            onMouseEnter={(e) => (e.target.style.background = "#dc2626")}
                                            onMouseLeave={(e) => (e.target.style.background = "#f87171")}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: "12px", textAlign: "center", color: "#64748b" }}>
                                    No vendors found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Home;
