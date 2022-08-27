import Header from "./Header";
import Footer from "./Footer";

const Layout=({children})=>{
    return(
        <div className="min-h-screen">
            <Header />
            <main className="min-h-[calc(100vh-6.25rem)]">{children}</main>
            <Footer />
        </div>
    )
}
export default Layout;