import React from "react";

const Navbar = () => {
    return (
        <nav
            style={{
                background: "#333",
                color: "#fff",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <h2 style={{ margin: 0 }}>Vendor App</h2>
            <ul
                style={{
                    listStyle: "none",
                    display: "flex",
                    gap: "15px",
                    margin: 0,
                }}
            >
                <li>Home</li>
                <li>Login</li>
                <li>Dashboard</li>
            </ul>
        </nav>
    );
};

export default Navbar;
