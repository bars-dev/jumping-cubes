import React from "react";
import {Button, Grid, Input, TextField} from "@material-ui/core";

class AddPlayerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {name: '', colour: '#' + (Math.random() * 0xffffff).toString(16).slice(-6)};
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
                <Grid container direction="column">
                    <TextField id="name-input"
                               label="Name"
                               value={this.state.name}
                               onChange={(event) => this.handleNameChange(event)}
                               required
                    />
                    <Input type="color"
                           value={this.state.colour}
                           onChange={(event) => this.handleColourChange(event)}
                           label="Colour"
                           required
                    />
                    <Grid container direction="row" justify="space-between">
                        <Button type="submit" variant="outlined" color="primary">Submit</Button>
                        <Button onClick={() => this.cancel()} variant="outlined" color="secondary">Cancel</Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default AddPlayerForm;
