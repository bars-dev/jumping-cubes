import React from 'react';
import './App.css';

class Die extends React.Component {
    render() {
        const dots = this.makeDieShape(this.props.numDots);
        return (
            <div className="die" onClick={this.props.clickAction}>
                <svg width="100%" viewBox="0 0 100 100" className="dieSvg">
                    <rect x="5" y="5" rx="10" ry="10" width="90" height="90" style={{fill: "white", stroke: "black"}}/>
                    {dots}
                </svg>
            </div>
        )
    }

    makeDieShape(numDots) {
        let dots = [];
        if (numDots % 2 === 1) {
            dots.push(<circle key={this.props.id + "centreCircle"} cx={50} cy={50} r={10}
                              fill={this.props.colour || "black"}/>);
        }
        if (numDots >= 2) {
            dots.push(<circle key={this.props.id + "topLeftCircle"} cx={25} cy={25} r={10}
                              fill={this.props.colour || "black"}/>);
            dots.push(<circle key={this.props.id + "bottomRightCircle"} cx={75} cy={75} r={10}
                              fill={this.props.colour || "black"}/>);
        }
        if (numDots >= 4) {
            dots.push(<circle key={this.props.id + "bottomLeftCircle"} cx={75} cy={25} r={10}
                              fill={this.props.colour || "black"}/>);
            dots.push(<circle key={this.props.id + "topRightCircle"} cx={25} cy={75} r={10}
                              fill={this.props.colour || "black"}/>);
        }
        return dots;
    }
}

function isNotUnTruthy(values) {
    for (let i of values) {
        if (i) {
            return true;
        }
    }
    return false;
}

class Board extends React.Component {
    render() {
        //Populate dice into display
        let finalArray = [];
        for (let j = 0; j < this.props.numDice; j++) {
            let dieArray = [];
            for (let i = j * this.props.numDice; i < (j + 1) * this.props.numDice; i++) {
                dieArray.push(this.renderDie(i));
            }
            finalArray.push(<div className="dieRow" key={"dieArray" + j}>{dieArray}</div>);
        }
        return finalArray;
    }

    renderDie(i) {
        return (
            <div key={"dieDiv" + i}>
                <Die key={i} id={i} colour={this.props.teamColour[i]} numDots={this.props.numDots[i]}
                     clickAction={() => this.props.onDieClick(i)}/>
            </div>
        )
    }
}

class GameControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addPlayer: false,
        }
    }

    addPlayer() {
        if (this.state.addPlayer) {
            return (
                <div className="modal">
                    <div className="modal-content">
                        <AddPlayerForm cancel={this.toggleAddPlayer.bind(this)}
                                       notifyOfSubmission={this.processNewPlayerSuggestion.bind(this)}/>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    renderPlayerList() {
        const playerList = [];
        for (let player of this.props.players) {
            playerList.push(<li key={"playerControl" + player.name} style={{color: player.colour}}>{player.name}</li>);
        }
        return (<div>
            <ul className="player-list">{playerList}</ul>
            <button onClick={() => this.toggleAddPlayer()}>Add player</button>
        </div>)
    }

    processNewPlayerSuggestion = (name, colour) => {
        for (let player of this.props.players) {
            if (name === player.name || colour === player.colour) {
                return false;
            }
        }
        this.props.notifyOfNewPlayer(name, colour);
        this.toggleAddPlayer();
        return true;
    };

    render() {
        return (
            <div>
                {this.renderPlayerList()}
                {this.addPlayer()}
            </div>
        );
    }

    toggleAddPlayer() {
        this.setState({addPlayer: !this.state.addPlayer});
    }
}

class AddPlayerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', colour: ''};
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleColourChange = this.handleColourChange.bind(this);
        this.notifyParent = (name, colour) => this.props.notifyOfSubmission(name, colour);
        this.cancel = () => this.props.cancel();
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleColourChange(event) {
        this.setState({colour: event.target.value});
    }

    handleSubmit(event) {
        if (this.notifyParent(this.state.name, this.state.colour)) {
            this.setState({name: '', colour: ''});
        }
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={(event) => this.handleSubmit(event)}>
                <div id="flexTable" className="flexTable">
                    <label>
                        Name: <input type="text"
                                     value={this.state.name}
                                     onChange={(event) => this.handleNameChange(event)}
                                     required/>
                    </label>
                    <label>
                        Colour: <input type="color"
                                       value={this.state.colour}
                                       onChange={(event) => this.handleColourChange(event)}
                                       required/>
                    </label>
                </div>
                <input type="submit" value="Submit"/>
                <button onClick={() => this.cancel()}>Cancel</button>
            </form>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [{"name": "red", "colour": "red"},
                {"name": "blue", "colour": "blue"}],
            teamColour: Array(3 ** 2).fill(null),
            numDots: Array(3 ** 2).fill(1),
            numDice: 3,
            currentTurn: 0,
            gameOver: false,
        };
    };

    checkVictory(dice) {
        const possibleWinner = dice[0];
        if (possibleWinner === null || possibleWinner === undefined) {
            return false;
        }
        for (let die of dice) {
            if (die !== possibleWinner) {
                return false;
            }
        }
        return true;
    };

    processNewPlayer(name, colour) {
        let newPlayers = this.state.players.slice();
        newPlayers.push({"name": name, "colour": colour});
        this.setState({players: newPlayers});
        this.resetBoard();
    };

    onDieClick(i) {
        if ((this.state.teamColour[i] !== this.state.players[this.state.currentTurn].colour && this.state.teamColour[i] !== null) || this.state.gameOver) {
            //do nothing
        } else {
            let newTeamColour = this.state.teamColour.slice();
            let newNumDots = this.state.numDots.slice();
            newTeamColour[i] = this.state.players[this.state.currentTurn].colour;
            newNumDots[i] = newNumDots[i] + 1;
            [newTeamColour, newNumDots] = this.actionRollover(newTeamColour, newNumDots);
            let newColourIdx = this.state.currentTurn;
            if (!this.checkVictory(newTeamColour)) {
                newColourIdx = (this.state.currentTurn + 1) % this.state.players.length;
                while (this.playerIsEliminated(newColourIdx, newTeamColour)) {
                    newColourIdx = (newColourIdx + 1) % this.state.players.length;
                    if (newColourIdx === this.state.currentTurn) {
                        throw new DOMException("No valid alternative players, game should have ended", "ImpossibleGameState");
                    }
                }
            }
            this.setState({
                teamColour: newTeamColour,
                numDots: newNumDots,
                currentTurn: newColourIdx,
                gameOver: this.checkVictory(newTeamColour),
            });
        }
    }

    actionRollover(newTeamColour, newNumDots) {
        let increaseValues = Array(newNumDots.length).fill(false);
        do {
            increaseValues.fill(false);
            for (let i = 0; i <= newNumDots.length; i++) {
                if (newNumDots[i] > this.numberNeighbours(i)) {
                    increaseValues[i] = null;
                    for (let idx of this.myNeighboursAre(i)) {
                        increaseValues[idx] = true;
                        newTeamColour[idx] = newTeamColour[i];
                    }
                }
            }
            for (let i = 0; i < increaseValues.length; i++) {
                if (increaseValues[i]) {
                    newNumDots[i]++;
                } else if (increaseValues[i] === null) {
                    newNumDots[i] = 1;
                }
            }
        }
        while (isNotUnTruthy(increaseValues));
        return [newTeamColour, newNumDots]
    }

    numberNeighbours(i) {
        if (i === 0) { // top left
            return 2;
        } else if (i === (this.state.numDice - 1)) { //top right
            return 2;
        } else if (i === (this.state.numDice ** 2 - 1)) { //bottom right
            return 2;
        } else if (i === (this.state.numDice ** 2 - this.state.numDice)) { //bottom left
            return 2;
        } else if (i <= this.state.numDice - 1) { //top row
            return 3;
        } else if (i < this.state.numDice ** 2 && i >= (this.state.numDice ** 2 - this.state.numDice)) { //bottom row
            return 3;
        } else if (i % this.state.numDice === 0) { //left side
            return 3;
        } else if (i % this.state.numDice === this.state.numDice - 1) { //right side
            return 3;
        } else { //middle
            return 4;
        }
    }

    myNeighboursAre(i) {
        const numDice = parseInt(this.state.numDice);
        if (i === 0) { // top left
            return [i + 1, i + numDice];
        } else if (i === (numDice - 1)) { //top right
            return [i - 1, i + numDice];
        } else if (i === (numDice ** 2 - 1)) { //bottom right
            return [i - 1, i - numDice];
        } else if (i === (numDice ** 2 - numDice)) { //bottom left
            return [i + 1, i - numDice];
        } else if (i <= numDice - 1) { //top row
            return [i - 1, i + 1, i + numDice];
        } else if (i < numDice ** 2 && i >= (numDice ** 2 - numDice)) { //bottom row
            return [i - 1, i + 1, i - numDice];
        } else if (i % numDice === 0) { //left side
            return [i - numDice, i + 1, i + numDice];
        } else if (i % numDice === numDice - 1) { //right side
            return [i - numDice, i - 1, i + numDice];
        } else { //middle
            return [i - numDice, i - 1, i + 1, i + numDice];
        }
    }

    resetBoard() {
        this.setState({
            teamColour: Array(this.state.numDice ** 2).fill(null),
            numDots: Array(this.state.numDice ** 2).fill(1),
            currentTurn: 0,
            gameOver: false,
        });
    }

    playerIsEliminated(i, newTeamColour) {
        for (let val of newTeamColour) {
            if (val === this.state.players[i].colour || val === null) {
                return false;
            }
        }
        return true;
    }

    render() {
        let finalArray = [];
        //Populate the current player/victory notice
        if (this.state.gameOver) {
            finalArray.push(<p key={"victoryNotice"}>The {this.state.teamColour[0]} player is the winner!</p>);
        } else {
            finalArray.push(<p key={"currentPlayerNotice"}>The current player
                is: {this.state.currentTurn}, {this.state.players[this.state.currentTurn].name}</p>);
        }
        //Reset button for the game board
        finalArray.push(<button onClick={() => this.resetBoard()} key="reset">Reset</button>);

        return (
            <div className="App">
                <div className="boardDiv">
                    <Board key="board"
                           numDice={this.state.numDice}
                           onDieClick={(i) => this.onDieClick(i)}
                           teamColour={this.state.teamColour}
                           numDots={this.state.numDots}
                    />
                </div>
                <div className="gameControlDiv">
                    <GameControl key="gameControl"
                                 notifyOfNewPlayer={this.processNewPlayer.bind(this)}
                                 numDice={this.state.numDice}
                                 players={this.state.players}
                                 teamColour={this.state.teamColour}
                                 currentTurn={this.state.currentTurn}
                                 numDots={this.state.numDots}
                    />
                </div>
                <div>
                    {finalArray}
                </div>
            </div>
        );
    };
}

export default App;
