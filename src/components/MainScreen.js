/* global BigInt */

import dead from "../icons/dead.png";
import machine from "../icons/machine.jpg"
import demBallot from "../icons/dem_ballot.png"
import repBallot from "../icons/rep_ballot.png"
import judge from "../icons/judge.png"
import thosePeople from "../icons/those_people.png"
import sim from "../icons/sim.png"
import donation from "../icons/make-a-donation.png"


import React, {Component} from 'react'
import produce from "immer";
import Ballot from "./ballot";
import VoteCount from "./VoteCount";
import AutoVoter from "./AutoVoter";
import {
    ACTIVIST_JUDGE_BASE_COST, ACTIVIST_JUDGE_TOOLTIP, ACTIVIST_JUDGE_VPS,
    DEAD_VOTER_BASE_COST, DEAD_VOTER_TOOLTIP, DEAD_VOTER_VPS,
    HACKED_VOTING_MACHINE_BASE_COST, HACKED_VOTING_MACHINE_TOOLTIP, HACKED_VOTING_MACHINE_VPS,
    URBAN_VOTER_BASE_COST, URBAN_VOTER_TOOLTIP,
    URBAN_VOTER_VPS
} from "./constants";
import {deadVoterAdd, demManualVote, judgeVoterAdd, machineVoterAdd, repManualVote, urbanVoterAdd} from "./voteLog";
import DonationLink from "./DonationLink";

class MainScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            renderAboutDialogue: false,
            showInstructions: true,
            showDonationLinks: false,
            showVPS: false,
            voteLog: [],
            votes: BigInt("0"),
            vps: 0,
            deadVoters: 0,
            urbanVoters: 0,
            hackedVotingMachines: 0,
            activistJudges: 0,
            currentCost: {
                deadVoter: DEAD_VOTER_BASE_COST,
                urbanVoter: URBAN_VOTER_BASE_COST,
                hackedVotingMachine: HACKED_VOTING_MACHINE_BASE_COST,
                activistJudge: ACTIVIST_JUDGE_BASE_COST
            }
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000)
    }

    tick = () => {
        const autoVotes = this.state.deadVoters * DEAD_VOTER_VPS +
            this.state.urbanVoters * URBAN_VOTER_VPS +
            this.state.hackedVotingMachines * HACKED_VOTING_MACHINE_VPS +
            this.state.activistJudges * ACTIVIST_JUDGE_VPS;

        this.setState(produce(draft => {
            draft.votes = draft.votes + BigInt(autoVotes)
            if (draft.votes >= 40) {
                draft.showDonationLinks = true;
            }
            if (autoVotes > 0) {
                draft.showVPS = true;
                draft.vps = autoVotes;
            }
        }))
    }

    addBallot = (candidate) => {
        this.setState(produce(draft => {
            draft.votes = draft.votes + BigInt(1);
            if (candidate === "D") {
                draft.voteLog = demManualVote(draft.voteLog)
            } else {
                draft.voteLog = repManualVote(draft.voteLog)
            }
        }))
    }

    addDeadVoter = () => {
        this.setState(produce(draft => {
            draft.deadVoters = draft.deadVoters + 1;
            draft.votes = draft.votes - BigInt(this.state.currentCost.deadVoter);
            draft.currentCost.deadVoter = Math.ceil(parseFloat(draft.currentCost.deadVoter) * 1.15)
            draft.voteLog = deadVoterAdd(draft.voteLog)
        }))
    }

    addUrbanVoters = () => {
        this.setState(produce(draft => {
            draft.urbanVoters = draft.urbanVoters + 1;
            draft.votes = draft.votes - BigInt(this.state.currentCost.urbanVoter);
            draft.currentCost.urbanVoter = Math.ceil(parseFloat(draft.currentCost.urbanVoter) * 1.15)
            draft.voteLog = urbanVoterAdd(draft.voteLog)
        }))
    }

    addMachineVote = () => {
        this.setState(produce(draft => {
            draft.hackedVotingMachines = draft.hackedVotingMachines + 1;
            draft.votes = draft.votes - BigInt(this.state.currentCost.hackedVotingMachine);
            draft.currentCost.hackedVotingMachine = Math.ceil(parseFloat(draft.currentCost.hackedVotingMachine) * 1.15)
            draft.voteLog = machineVoterAdd(draft.voteLog)
        }))
    }

    addActivistJudgeVote = () => {
        this.setState(produce(draft => {
            draft.activistJudges = draft.activistJudges + 1;
            draft.votes = draft.votes - BigInt(this.state.currentCost.activistJudge);
            draft.currentCost.activistJudge = Math.ceil(parseFloat(draft.currentCost.activistJudge) * 1.15)
            draft.voteLog = judgeVoterAdd(draft.voteLog)
        }))
    }

    getShowInstructionsClass = () => {
        if (this.state.showInstructions) {
            return "";
        }
        else {
            return "autovoter-fade"
        }
    }

    renderAutovoters = () => {
        return (
            <div className={"autovoters " + this.getShowInstructionsClass()}>
                <AutoVoter votes={this.state.votes}
                           cost={this.state.currentCost.deadVoter}
                           imageSource={dead}
                           autoVoterFn={this.addDeadVoter}
                           hoverText={DEAD_VOTER_TOOLTIP}
                           countTitle="Dead People"
                           autoVoterCount={this.state.deadVoters}
                />
                <AutoVoter votes={this.state.votes}
                           cost={this.state.currentCost.urbanVoter}
                           imageSource={thosePeople}
                           autoVoterFn={this.addUrbanVoters}
                           hoverText={URBAN_VOTER_TOOLTIP}
                           countTitle='"Urban" Voters'
                           autoVoterCount={this.state.urbanVoters}
                />

                <AutoVoter votes={this.state.votes}
                           cost={this.state.currentCost.hackedVotingMachine}
                           imageSource={machine}
                           autoVoterFn={this.addMachineVote}
                           hoverText={HACKED_VOTING_MACHINE_TOOLTIP}
                           countTitle="Hacked Voting Machines"
                           autoVoterCount={this.state.hackedVotingMachines}
                />
                <AutoVoter votes={this.state.votes}
                           cost={this.state.currentCost.activistJudge}
                           imageSource={judge}
                           autoVoterFn={this.addActivistJudgeVote}
                           hoverText={ACTIVIST_JUDGE_TOOLTIP}
                           countTitle="Activist Antifa Liberal Judges"
                           autoVoterCount={this.state.activistJudges}
                />
            </div>
        )
    }

    renderVoterText = () => {
        const votesStr = this.state.votes.toString();
        if (this.state.showInstructions) {
            if (votesStr === "0") {
                return "Cast your vote by clicking on a ballot below!"
            } else if (votesStr === "1") {
                return "Great Job! Your vote was counted in the Tamper Proof Vote Log. Did you know can vote again?"
            } else if (votesStr === "2") {
                return "Now you're getting it. You can vote as many times as you like!"
            } else if (votesStr === "3") {
                return "Voting is easy. No ID necessary! Just click and your vote will be correctly registered."
            } else if (votesStr === "4") {
                return "That voting finger is going to get tired soon enough. Maybe we can help you out..."
            } else if (votesStr === "5") {
                this.setState(produce(draft => {
                    draft.showInstructions = false;
                }))
            }
        }
        if (this.state.showDonationLinks) {
            return "On a serious note, Georgia needs you. Click the links below to learn about and donate to the " +
                "amazing candidates running in the Georgia Senate Runoff"
        }

        return "Democracy in Action! Now you can use your new found power to hire your own helpers. " +
            "Spend votes to buy AutoVoters who can cast votes per second"
    }

    getDonationLinksClass = () => {
        if (this.state.showDonationLinks) {
            return "autovoter-fade";
        }
        else {
            return ""
        }
    }

    renderDonationLinks = () => {
        return (
            <div className={"autovoters " + this.getDonationLinksClass()}>
                <DonationLink text="Jon Ossoff for Georgia"
                              targetUrl="https://electjon.com"
                              image={donation}/>
                <DonationLink text="Raphael Warnock for Georgia"
                              targetUrl="https://warnockforgeorgia.com"
                              image={donation}/>

            </div>
        )
    }

    showAboutDialogue = () => {
        this.setState(produce(draft => {
            draft.renderAboutDialogue = true
        }))
    }

    hideAboutDialogue = () => {
        this.setState(produce(draft => {
            draft.renderAboutDialogue = false
        }))
    }

    renderAboutDialogue = () => {
        const kofiStyle = {
            border:'0px',
            height:'36px'
        }
        if (this.state.renderAboutDialogue) {
            return (
                <div className="about-dialogue">
                    <h2>
                        Election Simulator - 2020
                    </h2>
                    <p>
                        V1.0
                    </p>
                    <p>
                        The Election Simulator - 2020 is an incremental idle clicker game inspired by
                        <a href={"https://orteil.dashnet.org/cookieclicker/"} target="_blank"> Cookie Clicker </a>
                        and <a href={"https://www.decisionproblem.com/paperclips/"} target="_blank">Universal Paperclips</a>.
                    </p>

                    <h3>
                        How to Play
                    </h3>
                    <p>
                        You click on ballots to get votes, and then you spend your votes to acquire auto-voters, which are
                        widgets that will vote for you.
                    </p>

                    <h3>
                        About
                    </h3>

                    <p>
                        If it's not immediately obvious, it is a work of satire meant to point out the
                        absurdity of Republican arguments against the legitimacy of the 2020 election. It doubles as a
                        basic and fun idle clicker game that will also hopefully raise some money for the upcoming
                        senate runoff in Georgia. See the donation links below.
                    </p>
                    <p>
                        Design consultation provided by <a href="https://github.com/aastey" target="_blank">Amanda Astey</a> <br/>
                    </p>
                    <p>
                        Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">
                        Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</a>
                    </p>
                    <p>
                        Made with &lt;3 using React by <a href="https://github.com/calebastey" target="_blank">me</a>.
                    </p>

                    <h3>
                        Donate Here
                    </h3>
                    <p>
                        <div className={"autovoters autovoter-fade"}>
                            <DonationLink text="Jon Ossoff for Georgia"
                                          targetUrl="https://electjon.com"
                                          image={donation}/>
                            <DonationLink text="Raphael Warnock for Georgia"
                                          targetUrl="https://warnockforgeorgia.com"
                                          image={donation}/>

                        </div>
                    </p>
                    <p>
                        <a href='https://ko-fi.com/Z8Z12TBMK' target='_blank'>
                            <img height='36' style={kofiStyle} src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2'
                                 border='0' alt='Buy Me a Coffee at ko-fi.com' />
                        </a>
                    </p>
                    <button onClick={this.hideAboutDialogue}>Close</button>
                </div>
            )
        } else {
            return null;
        }
    }

    renderVPS = () => {
        if (this.state.showVPS) {
            return (
                <div className="vps-counter">
                    Your auto-voters are generating <span className="vote-count blue">{this.state.vps} </span> votes/second for Joe Biden!
                </div>
            )
        }
        else {
            return null
        }
    }

    render() {
        return (
            <div className="main-container">
                {this.renderAboutDialogue()}
                <div className="about-link">
                    <p onClick={this.showAboutDialogue}>
                        About
                    </p>
                </div>
                <div className="image-header">
                    <img src={sim} height={"200px"}/>
                </div>
                <p className="banner-caveat">
                    (According to Republicans)
                </p>
                <div className="vote-count-header">
                    There are <span className="vote-count red">Eleventy Billion</span> votes for Donald Trump
                </div>
                <VoteCount votes={this.state.votes.toString()}/>

                {this.renderVPS()}

                <div className="helper-banner">
                    <span>
                        {this.renderVoterText()}
                    </span>
                </div>

                <div className="ballots">
                    <Ballot icon={demBallot} addBallot={this.addBallot} candidate="D"/>
                    <Ballot icon={repBallot} addBallot={this.addBallot} candidate="R"/>
                </div>

                {this.renderAutovoters()}

                {this.renderDonationLinks()}

                <div className="voter-log">
                    <h4>Tamper Proof Vote Log</h4>
                    <ul>
                    {
                        this.state.voteLog.map((item) => (
                            <li>{item}</li>
                        ))
                    }
                    </ul>
                </div>
            </div>
        )
    }
}

export default MainScreen
