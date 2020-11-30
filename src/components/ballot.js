import React, {Component} from 'react'
import './styles.css'

class Ballot extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hovering: false,
            mouseDown: false
        };
    }

    mouseDown = () => {
        this.setState({mouseDown: true})
    }

    mouseUp = () => {
        this.setState({mouseDown: false})
    }

    handleHover = () => {
        this.setState(prevState => ({hovering: !prevState.hovering}));
    }


    getClasses = () => {
        let classes = "ballot ballot-button"
        if (this.state.hovering) {
            if (this.state.mouseDown) {
                classes += " mouseDown"
            } else {
                classes += " hovering"
            }
        }

        return classes
    }

    render() {
        return (
            <div onClick={() => this.props.addBallot(this.props.candidate)}
                 className={this.getClasses()}
                 onMouseDown={this.mouseDown}
                 onMouseUp={this.mouseUp}
                 onMouseEnter={this.handleHover}
                 onMouseLeave={this.handleHover}>
                <img src={this.props.icon} alt="logo" height="200px"/>
            </div>
        )
    }
}

export default Ballot
