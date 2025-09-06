import React, { useEffect, useState } from "react";
import API from "../services/api";

const Home = () => {
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState({ name: "", contactNumber: "", location: "" });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setForm({
            name: vendor.name,
            contactNumber: vendor.contactNumber,
            location: vendor.location,
        });
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
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Vendor Management</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ marginRight: "10px", padding: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    value={form.contactNumber}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    required
                    style={{ marginRight: "10px", padding: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    style={{ marginRight: "10px", padding: "5px" }}
                />
                <button type="submit" style={{ padding: "6px 12px" }}>
                    {editingId ? "Update Vendor" : "Add Vendor"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ name: "", contactNumber: "", location: "" });
                            setEditingId(null);
                        }}
                        style={{ marginLeft: "10px", padding: "6px 12px" }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* Vendor List */}
            <h2>Vendors</h2>
            {loading ? (
                <p>Loading vendors...</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length > 0 ? (
                            vendors.map((v) => (
                                <tr key={v._id}>
                                    <td>{v.name}</td>
                                    <td>{v.contactNumber}</td>
                                    <td>{v.location}</td>
                                    <td style={{ color: v.status === "Inactive" ? "red" : "green" }}>
                                        {v.status}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(v)} style={{ marginRight: "10px" }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(v._id)} style={{ color: "red" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No vendors found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Home;
