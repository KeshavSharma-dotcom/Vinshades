import NavBar from '../components/NavBar'
import '../assets/styles/Home.css'

export default function Home() {
    return (
        <div className="home">
            <NavBar />
            <div className="background-effects">
                <div className="gradient"></div>
                <div className="fog"></div>
                <div className="flames"></div>
                <div className="embers"></div>
            </div>
            <main className="home-overlay">
                <h1 className="home-title">VINSHADES</h1>
                <div className="home-subtitle">
                    <p>Explore webgames</p>
                    <p>Play &rarr;</p>
                </div>
            </main>
        </div>
    )
}