import React, { useState, useEffect } from 'react';
import ipConfig from '../ip.json';
import '../App.css';

const Leaderboard = () => {
    const [teams, setTeams] = useState([]);

    const fetchData = () => {
        // Fetch the data from your API and update the state
        fetch(`http://${ipConfig.ip}:3001/api/teams`)
            .then((res) => res.json())
            .then((data) => {
                // Sort the teams by score in descending order
                const sortedTeams = data.sort((a, b) => b.score - a.score);
                setTeams(sortedTeams);
            });
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ textAlign: 'center', backgroundColor: '#77dd77', padding: '2rem', height: '100vh' }}>
            <h1 style={{ marginBottom: '2rem' }}>Leaderboard</h1>
            <table style={{ margin: '0 auto' }}>
                <thead>
                <tr>
                    <th style={{ padding: '1rem' }}>Rank</th>
                    <th style={{ padding: '1rem' }}>Team Name</th>
                    <th style={{ padding: '1rem' }}>Score</th>
                </tr>
                </thead>
                <tbody>
                {teams.map((team, index) => (
                    <tr key={team.name}>
                        <td style={{ padding: '1rem' }}>{index + 1}</td>
                        <td style={{ padding: '1rem' }}>{team.name}</td>
                        <td style={{ padding: '1rem' }}>{team.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
