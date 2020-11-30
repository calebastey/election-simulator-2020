import React, {Component} from 'react'
import './styles.css'

class VoteCount extends Component {

    render() {
        return (
            <div className="vote-count-header">
               There are <span className="vote-count blue">{this.props.votes}</span> votes for Joe Biden.
            </div>
        )
    }
}

export default VoteCount
