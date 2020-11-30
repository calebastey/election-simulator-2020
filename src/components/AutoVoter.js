/* global BigInt */

import React, {Component} from 'react'

class AutoVoter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    handleMouseIn = () => {
        this.setState({ hover: true })
    }

    handleMouseOut = () => {
        this.setState({ hover: false })
    }

    getVisibility = () => {
        const cost = BigInt(this.props.cost)
        let enabled = "auto-vote-disabled"
        if (this.props.votes >= cost) {
            enabled = "auto-vote-enabled"
        }
        return enabled
    }

    renderTooltip = () => {
        if (this.state.hover) {
            return "tooltip"
        } else {
            return "no-tooltip"
        }

    }

    render() {
        return (
            <div className={"autovoter " + this.getVisibility()}
                 onMouseEnter={this.handleMouseIn}
                 onMouseLeave={this.handleMouseOut}
                 onClick={this.props.autoVoterFn}
                >
                <div className="tooltip-wrapper">
                    <div className={this.renderTooltip()}><p>{this.props.hoverText}</p></div>
                </div>

                <span className="autovoter-cost">Cost: {this.props.cost} Votes</span><br/>
                <img src={this.props.imageSource}/>
                <br/>
                <span className={'autovoter-text'}>{this.props.countTitle}: {this.props.autoVoterCount}</span>
            </div>
        )
    }
}

export default AutoVoter
