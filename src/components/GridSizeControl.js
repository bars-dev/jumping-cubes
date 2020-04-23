import React from 'react';
import {Button, Grid, Input} from "@material-ui/core";

class GridSizeControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {numGrid: 3}
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.notifyParent = (number) => this.props.notifyOfSubmission(number);
        this.cancel = () => this.props.cancel();
    }

    render() {
        return (
            <form onSubmit={(event) => this.handleSubmit(event)}>
                <Grid container direction="column">
                    <Input type="number"
                           value={this.state.numGrid}
                           onChange={(event) => this.handleNumberChange(event)}
                           label="Colour"
                           required
                    />
                    <Grid container direction="row" justify="space-between">
                        <Button type="submit" variant="outlined" color="primary">Submit</Button>
                        <Button onClick={() => this.cancel()} variant="outlined" color="secondary">Cancel</Button>
                    </Grid>
                </Grid>
            </form>
        )
    }

    handleNumberChange(event) {
        this.setState({numGrid: event.target.value});
    }

    handleSubmit(event) {
        this.notifyParent(this.state.numGrid)
        event.preventDefault();
    }
}

export default GridSizeControl;
