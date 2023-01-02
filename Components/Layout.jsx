import Navbar from "./Navbar";

export default function({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}