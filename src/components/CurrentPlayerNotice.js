import React from "react";
import Die from "./Die"
import Grid from "@material-ui/core/Grid";
import DeleteIcon from '@material-ui/icons/Delete';

class CurrentPlayerNotice extends React.Component {
    createList() {
        let playerList = [];
        for (let player of this.props.players) {
            if (player === this.props.currentPlayer) {
                playerList.push(
                    <Grid container
                          direction="row"
                          justify="flex-start"
                          alignItems="center">
                        <span>
                        <Die id="displayDie"
                             numDots={5}
                             colour={player.colour}
                             clickAction={() => {
                                 return null
                             }}
                             width="25px"
                        />
                            {player.name}</span>
                        <DeleteIcon onClick={() => this.props.removePlayer(player)}/>
                    </Grid>
                )
            } else {
                playerList.push(
                    <Grid container
                          direction="row"
                          justify="flex-start"
                          alignItems="center">
                        <Die id="displayDie"
                             numDots={5}
                             colour="Grey"
                             clickAction={() => {
                                 return null
                             }}
                             width="25px"
                        />
                        {player.name}
                        <DeleteIcon onClick={() => this.props.removePlayer(player)}/>
                    </Grid>
                )
            }
        }
        return playerList;
    }

    createAllColouredList() {
        let playerList = [];
        for (let player of this.props.players) {
            playerList.push(
                <Grid container
                      direction="row"
                      justify="space-evenly"
                      alignItems="center"
                >
                    <Die id="displayDie"
                         numDots={5}
                         colour={player.colour}
                         clickAction={() => {
                             return null
                         }}
                         width="25px"
                    />
                    {player.name}
                    <DeleteIcon onClick={() => this.props.removePlayer(player)}/>
                </Grid>
            )
        }
        return playerList;
    }

    renderSinglePlayer() {
        return (
            <span>
                <Grid container direction="row">
                    Current Turn:
                    <Die id="displayDie"
                         numDots={5}
                         colour={this.props.currentPlayer.colour}
                         clickAction={() => {
                             return null
                         }}
                         width="25px"
                    />
                    {this.props.currentPlayer.name}
                </Grid>
            </span>
        );
    }

    render() {
        if (this.props.singular !== undefined && this.props.singular) {
            return this.renderSinglePlayer()
        } else {
            if (this.props.allColoured !== undefined && this.props.allColoured) {
                return this.createAllColouredList()
            } else {
                return this.createList()
            }
        }
    }
}

export default CurrentPlayerNotice
