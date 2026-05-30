import SideBar from "./sidebar";

function HomePage() {
    return (
        <>
            <div style={{ display: "flex" }}>
                <SideBar />

                <div style={{ flex: 1, padding: "30px" }}>
                    <h1>Welcome to Splitwise</h1>
                </div>
            </div>
        </>
    );
}

export default HomePage;