import React from 'react';

class Die extends React.Component {
    render() {
        const dots = this.makeDieShape(this.props.numDots);
        return (
            <span className="die" onClick={this.props.clickAction}>
                <svg width={this.props.width || "100%"} viewBox="0 0 100 100" className="dieSvg">
                    <rect x="5" y="5" rx="10" ry="10" width="90" height="90" style={{fill: "white", stroke: "black"}}/>
                    {dots}
                </svg>
            </span>
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

export default Die;
