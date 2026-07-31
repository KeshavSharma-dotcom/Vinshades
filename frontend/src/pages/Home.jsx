import "../assets/styles/Home.css"
import { useNavigate } from "react-router"

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="home">
            <div className="background-effects">
                <div className="flames"></div>
                <div className="embers"></div>
                <div className="fog"></div>
            </div>

            <div className="home-overlay">
                <h1 className="home-title">Vinshades</h1>
                <p className="home-subtitle">Explore webgames</p>
                <div className="games-section">
                    <button className="game-card" onClick={() => navigate("/mystic-kitchen")}>
                        <div className="game-glow"></div>
                        <h2 className="game-title">
                            Mystic Kitchen
                        </h2>
                        <p className="game-description">
                            Master enchanted recipes, serve mystical creatures,
                            and build the greatest magical kitchen.
                        </p>
                        <span className="game-button">
                            Play →
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}