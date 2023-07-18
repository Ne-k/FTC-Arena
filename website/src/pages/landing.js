import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleScoringClick = () => {
        navigate('/scoring');
    };

    const handleLeaderboardClick = () => {
        navigate('/leaderboard');
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(to bottom, #AEC6CF, #FFFACD, #FF6961)',
            }}
        >
            <button
                style={{
                    fontSize: '2rem',
                    padding: '1rem 2rem',
                    margin: '0 1rem',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
                }}
                onClick={handleScoringClick}
            >
                Scoring
            </button>
            <button
                style={{
                    fontSize: '2rem',
                    padding: '1rem 2rem',
                    margin: '0 1rem',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
                }}
                onClick={handleLeaderboardClick}
            >
                Leaderboard
            </button>
        </div>
    );
};

export default LandingPage;
