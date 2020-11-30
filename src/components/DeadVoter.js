import dead from "../icons/dead.png";

import React, {Component} from 'react'

class DeadVoter extends Component {

    render() {
        return (
            <div>
                <span>Hire a Dead Person to Vote for Joe Biden</span>
                <img src={dead} onClick={this.props.addDeadVoter} />
                <span>Current Dead Voters: {this.props.deadVoters}</span>
            </div>
        )
    }
}

export default DeadVoter
