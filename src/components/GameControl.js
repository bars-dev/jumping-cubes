import React from "react";
import AddPlayerForm from "./AddPlayerForm";
import {Button, Dialog} from "@material-ui/core";
import CurrentPlayerNotice from "./CurrentPlayerNotice";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import GridSizeControl from "./GridSizeControl";

class GameControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addPlayer: false,
            gridSizeControl: false,
        }
    }


    renderPlayerList() {
        return (
            <Grid
                container
                direction="column"
                justify="space-evenly"
                alignItems="flex-start"
            >
                <Typography variant="h6">Players:</Typography>
                <CurrentPlayerNotice players={this.props.players}
                                     currentPlayer={this.props.players[this.props.currentTurn]}
                                     singular={false}
                                     allColoured={true}
                                     removePlayer={(player) => this.props.removePlayer(player)}
                />
                <Button onClick={() => this.toggleAddPlayer()} variant="outlined" color="primary">Add player</Button>
                <Button onClick={() => this.toggleGridSizeControl()} variant="outlined" color="primary">Resize Game
                    Board</Button>
            </Grid>
        )
    }

    processNewPlayerSuggestion = (name, colour) => {
        if (colour === "#ffffff" || colour === "#000000") {
            return false;
        }
        if (name.length > 40) {
            return false;
        }
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
                <Dialog onClose={() => this.toggleAddPlayer()} open={this.state.addPlayer}>
                    <AddPlayerForm cancel={this.toggleAddPlayer.bind(this)}
                                   notifyOfSubmission={this.processNewPlayerSuggestion.bind(this)}/>
                </Dialog>
                <Dialog onClose={() => this.toggleGridSizeControl()} open={this.state.gridSizeControl}>
                    <GridSizeControl cancel={() => this.toggleGridSizeControl()}
                                     notifyOfSubmission={(number) => this.processNewGridSize(number)}/>
                </Dialog>
            </div>
        );
    }

    toggleAddPlayer() {
        this.setState({addPlayer: !this.state.addPlayer});
    }

    toggleGridSizeControl() {
        this.setState({gridSizeControl: !this.state.gridSizeControl});
    }

    processNewGridSize(number) {
        this.props.processNewGridSize(number);
        this.toggleGridSizeControl()
    }
}

export default GameControl;
