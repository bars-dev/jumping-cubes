import React from 'react';
import Die from './Die'

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
            <div key={this.props.numDice + "dieDiv" + i}>
                <Die key={this.props.numDice + "die" + i} id={i} colour={this.props.teamColour[i]}
                     numDots={this.props.numDots[i]}
                     clickAction={() => this.props.onDieClick(i)}/>
            </div>
        )
    }
}

export default Board;
