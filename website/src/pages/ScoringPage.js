import React, { useState, useEffect } from 'react';
import ipConfig from '../ip.json';
import '../App.css';

const ScoreBox = ({ label, score, onIncrement, onDecrement, onScoreChange }) => (
    <div>
        <h2>{label}</h2>
        <button onClick={onIncrement}>↑</button>
        <input
            type="number"
            value={score}
            onChange={e => onScoreChange(parseInt(e.target.value))}
            style={{ width: '3rem', textAlign: 'center' }}
        />
        <button onClick={onDecrement}>↓</button>
    </div>
);


const MatchBox = ({ matchNumber = 0, onIncrement, onDecrement }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingBottom: '1rem',
        }}
    >
        <h2 style={{ margin: '0 1rem' }}>Match Number</h2>
        <button
            onClick={onIncrement}
            style={{
                backgroundColor: 'black',
                color: 'white',
                fontSize: '1.5rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
            }}
        >
            ↑
        </button>
        <span style={{ margin: '0 1rem' }}>{matchNumber}</span>
        <button
            onClick={onDecrement}
            style={{
                backgroundColor: 'black',
                color: 'white',
                fontSize: '1.5rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
            }}
        >
            ↓
        </button>
    </div>
);

const ScoringPage = () => {
    const [scores, setScores] = useState({ red1: 0, red2: 0, blue1: 0, blue2: 0 });
    const [matchId, setMatchId] = useState(null);
    const [matchNumber, setMatchNumber] = useState(0);
    const [creatingMatch, setCreatingMatch] = useState(false);
    const [teamNames, setTeamNames] = useState({
        red1TeamName: '',
        red2TeamName: '',
        blue2TeamName: '',
    });
    const [creatingNewMatch, setCreatingNewMatch] = useState(false);

    useEffect(() => {
        fetch(`http://${ipConfig.ip}:3001/api/matchByNumber/${matchNumber}`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    // Match with specified match number exists
                    setMatchId(data._id);
                    setScores({ red1: data.red1, red2: data.red2, blue1: data.blue1, blue2: data.blue2 });
                    setTeamNames({
                        red1TeamName: data.red1TeamName,
                        red2TeamName: data.red2TeamName,
                        blue1TeamName: data.blue1TeamName,
                        blue2TeamName: data.blue2TeamName,
                    });
                } else if (matchNumber !== 0 && !creatingNewMatch) {
                    // Match with specified match number does not exist, match number is not 0, and a new match is not already being created, create a new match
                    setCreatingNewMatch(true);
                    fetch(`http://${ipConfig.ip}:3001/api/newMatch`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            matchNumber,
                            red1: 0,
                            red2: 0,
                            blue1: 0,
                            blue2: 0,
                            red1TeamName: teamNames.red1TeamName.toLowerCase(),
                            red2TeamName: teamNames.red2TeamName.toLowerCase(),
                            blue1TeamName: teamNames.blue1TeamName.toLowerCase(),
                            blue2TeamName: teamNames.blue2TeamName.toLowerCase(),
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            setMatchId(data._id);
                            setCreatingNewMatch(false);
                        });
                }
            });
    }, [matchNumber]);

    const handleIncrement = team => {
        setScores(scores => ({ ...scores, [team]: scores[team] + 1 }));
        updateScore(team, 1);
    };

    const handleDecrement = team => {
        setScores(scores => ({ ...scores, [team]: scores[team] - 1 }));
        updateScore(team, -1);
    };

    const handleScoreChange = (team, newScore) => {
        setScores(scores => ({ ...scores, [team]: newScore }));
        updateScore(team, newScore - scores[team]);
    };

    const updateScore = (team, change) => {
        if (!matchId) return;
        // Update the score in the database
        fetch(`http://${ipConfig.ip}:3001/api/updateScore/${matchId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [team]: scores[team] + change }),
        });
    };

    const handleMatchNumberIncrement = () => {
        if (
            !teamNames.red1TeamName ||
            !teamNames.red2TeamName ||
            !teamNames.blue1TeamName ||
            !teamNames.blue2TeamName
        ) {
            alert('Please enter a team name for all teams before incrementing the match number.');
            return;
        }
        setCreatingMatch(true);
        const newMatchNumber = matchNumber + 1;
        setMatchNumber(newMatchNumber);
        setScores({ red1: 0, red2: 0, blue1: 0, blue2: 0 });
        setCreatingMatch(false);
    };

    const handleMatchNumberDecrement = () => {
        if (matchNumber === 0) return;
        const newMatchNumber = matchNumber - 1;
        setMatchNumber(newMatchNumber);
    };

    return (
        <div className="container">
            <MatchBox
                matchNumber={matchNumber}
                onIncrement={handleMatchNumberIncrement}
                onDecrement={handleMatchNumberDecrement}
            />
            <div className="top-half">
                <label>
                    Red 1 Name:
                    <input
                        type="text"
                        placeholder="Red 1 Team Name"
                        value={teamNames.red1TeamName}
                        onChange={e =>
                            setTeamNames(teamNames => ({ ...teamNames, red1TeamName: e.target.value }))
                        }
                    />
                </label>
                <label>
                    Red 2 Name:
                    <input
                        type="text"
                        placeholder="Red 2 Team Name"
                        value={teamNames.red2TeamName}
                        onChange={e =>
                            setTeamNames(teamNames => ({ ...teamNames, red2TeamName: e.target.value }))
                        }
                    />
                </label>
                {matchNumber > 0 && (
                    <>
                        <ScoreBox
                            label="Red 1"
                            score={scores.red1}
                            onIncrement={() => handleIncrement('red1')}
                            onDecrement={() => handleDecrement('red1')}
                            onScoreChange={newScore => handleScoreChange('red1', newScore)}
                        />
                        <ScoreBox
                            label="Red 2"
                            score={scores.red2}
                            onIncrement={() => handleIncrement('red2')}
                            onDecrement={() => handleDecrement('red2')}
                            onScoreChange={newScore => handleScoreChange('red2', newScore)}
                        />
                    </>
                )}
            </div>
            <div className="bottom-half">
                <label>
                    Blue 1 Name:
                    <input
                        type="text"
                        placeholder="Blue 1 Team Name"
                        value={teamNames.blue1TeamName}
                        onChange={e =>
                            setTeamNames(teamNames => ({ ...teamNames, blue1TeamName: e.target.value }))
                        }
                    />
                </label>
                <label>
                    Blue 2 Name:
                    <input
                        type="text"
                        placeholder="Blue 2 Team Name"
                        value={teamNames.blue2TeamName}
                        onChange={e =>
                            setTeamNames(teamNames => ({ ...teamNames, blue2TeamName: e.target.value }))
                        }
                    />
                </label>
                {matchNumber > 0 && (
                    <>
                        <ScoreBox
                            label="Blue 1"
                            score={scores.blue1}
                            onIncrement={() => handleIncrement('blue1')}
                            onDecrement={() => handleDecrement('blue1')}
                            onScoreChange={newScore => handleScoreChange('blue1', newScore)}
                        />
                        <ScoreBox
                            label="Blue 2"
                            score={scores.blue2}
                            onIncrement={() => handleIncrement('blue2')}
                            onDecrement={() => handleDecrement('blue2')}
                            onScoreChange={newScore => handleScoreChange('blue2', newScore)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ScoringPage;
