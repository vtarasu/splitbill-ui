import { Link } from "react-router-dom";

function SideBar() {

    const menus = [
        { name: 'Balances', path: '/balances' },
        { name: 'Groups', path: '/groups' },
        { name: 'Payment History', path: '/settlements' },
        { name: 'Settings', path: '/settings' },
        { name: 'Logout', path: '/logout' }
    ];

    return (
        <>
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>Split Your Bill</h2>
                <div style={styles.menuContainer}>
                    {menus.map((menu) => (
                        <Link key={menu.name} to={menu.path}
                            style={styles.menuItem}>
                            {menu.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

const styles = {
    sidebar: {
        width: "250px",
        height: "100vh",
        background: "#f5f5f5",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
    },

    logo: {
        marginBottom: "40px",
        color: "#16a34a",
    },

    menuContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
    },

    menuItem: {
        padding: "14px 16px",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "0.2s",
    },
};

export default SideBar;