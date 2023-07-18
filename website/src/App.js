import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ScorePage from './pages/ScoringPage'; // Update the path to match the location of your ScorePage component
import Leaderboard from './pages/leaderboard';
import LandingPage from './pages/landing'; // Update the path to match the location of your LandingPage component
import './App.css'; // Update the path to match the location of your App.css file

function AnimationWrapper() {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/scoring" element={<ScorePage />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    {/* Add your other routes here */}
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<AnimationWrapper />} />
            </Routes>
        </Router>
    );
}

export default App;
