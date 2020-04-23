import React from "react";
import "./App.css";
import {AppBar, Button, Grid, IconButton, Toolbar, Typography} from "@material-ui/core";
import Board from "./components/Board"
import GameControl from "./components/GameControl";
import MenuIcon from "@material-ui/icons/Menu"
import Drawer from "@material-ui/core/Drawer";
import CurrentPlayerNotice from "./components/CurrentPlayerNotice";
import Hidden from "@material-ui/core/Hidden";

function isNotUnTruthy(values) {
    for (let i of values) {
        if (i) {
            return true;
        }
    }
    return false;
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [{"name": "Red", "colour": "red"},
                {"name": "Blue", "colour": "blue"}],
            teamColour: Array(3 ** 2).fill(null),
            numDots: Array(3 ** 2).fill(1),
            numDice: 3,
            currentTurn: 0,
            gameOver: false,
            drawerOpen: false,
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

    processGridResize(number) {
        this.setState({numDice: number});
        this.resetBoard(number);
    }

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

    resetBoard(numDice) {
        if (numDice !== undefined && numDice > 1) {
            this.setState({
                teamColour: Array(numDice ** 2).fill(null),
                numDots: Array(numDice ** 2).fill(1),
                currentTurn: 0,
                gameOver: false,
            });

        } else {
            this.setState({
                teamColour: Array(this.state.numDice ** 2).fill(null),
                numDots: Array(this.state.numDice ** 2).fill(1),
                currentTurn: 0,
                gameOver: false,
            });
        }
    }

    playerIsEliminated(i, newTeamColour) {
        for (let val of newTeamColour) {
            if (val === this.state.players[i].colour || val === null) {
                return false;
            }
        }
        return true;
    }

    toggleDrawer(value) {
        this.setState({drawerOpen: value});
        this.resetBoard();
    }

    getDrawer() {
        return (
            <nav>
                <Hidden xsDown>
                    <Drawer anchor={"left"}
                            variant="permanent"
                            open={this.state.drawerOpen}
                            onClose={() => this.toggleDrawer(false)}
                    >
                        <GameControl key="gameControl"
                                     notifyOfNewPlayer={this.processNewPlayer.bind(this)}
                                     numDice={this.state.numDice}
                                     players={this.state.players}
                                     teamColour={this.state.teamColour}
                                     currentTurn={this.state.currentTurn}
                                     numDots={this.state.numDots}
                                     removePlayer={(i) => this.removePlayer(i)}
                                     processNewGridSize={(number) => this.processGridResize(number)}
                        />
                    </Drawer>
                </Hidden>
                <Hidden smUp>
                    <Drawer anchor={"left"}
                            variant="temporary"
                            open={this.state.drawerOpen}
                            onClose={() => this.toggleDrawer(false)}
                    >
                        <GameControl key="gameControl"
                                     notifyOfNewPlayer={this.processNewPlayer.bind(this)}
                                     numDice={this.state.numDice}
                                     players={this.state.players}
                                     teamColour={this.state.teamColour}
                                     currentTurn={this.state.currentTurn}
                                     numDots={this.state.numDots}
                                     removePlayer={(i) => this.removePlayer(i)}
                                     processNewGridSize={(number) => this.processGridResize(number)}
                        />
                    </Drawer>
                </Hidden>
            </nav>
        )
    }

    menuButton() {
        return (
            <IconButton edge="start" color="inherit" aria-label="menu">
                <React.Fragment key={"left"}>
                    <MenuIcon onClick={() => this.toggleDrawer(true)}/>
                </React.Fragment>
            </IconButton>
        )
    }

    removePlayer(player) {
        if (this.state.players.length > 1) {
            let playerList = this.state.players.slice();
            playerList.splice(playerList.indexOf(player), 1)
            this.setState({players: playerList})
            return true;
        } else {
            return false;
        }
    }

    render() {
        let finalArray = [];
        //Populate the current player/victory notice
        if (this.state.gameOver) {
            finalArray.push(<p key={"victoryNotice"}>The {this.state.teamColour[0]} player is the winner!</p>);
        }
        //Reset button for the game board
        finalArray.push(<Button onClick={() => this.resetBoard()} key="reset" variant="outlined"
                                color="primary">Reset</Button>);


        return (
            <div>
                {this.getDrawer()}
                <AppBar position="static">
                    <Toolbar>
                        {this.menuButton()}
                        <Typography variant="h6">
                            Jumping Cubes
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Board
                        key="board"
                        numDice={this.state.numDice}
                        onDieClick={(i) => this.onDieClick(i)}
                        teamColour={this.state.teamColour}
                        numDots={this.state.numDots}
                    />
                    <CurrentPlayerNotice
                        singular={true}
                        players={this.state.players}
                        currentPlayer={this.state.players[this.state.currentTurn]}/>
                    {finalArray}
                </Grid>
            </div>
        );
    };
}

export default App;
