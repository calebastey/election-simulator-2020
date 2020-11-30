/* global BigInt */

import React, {Component} from 'react'

class DonationLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    handleMouseIn = () => {
        this.setState({hover: true})
    }

    handleMouseOut = () => {
        this.setState({hover: false})
    }

    render() {
        return (
            <a className="autovoter donation-link"
               onMouseEnter={this.handleMouseIn}
               onMouseLeave={this.handleMouseOut}
               href={this.props.targetUrl} target="_blank"
               rel="noreferrer noopener">
                <span className="autovoter-cost">Donate: $$$</span><br/>

                <img src={this.props.image}
                     height="75px"
                     alt={this.props.text}/>
                <br/>
                <span className='autovoter-text'>{this.props.text}</span>

            </a>

        )
    }


}

export default DonationLink
