function updateVoteLog(currentLog, entry) {
    while (currentLog.length > 50) {
        currentLog.pop()
    }
    currentLog.unshift(entry)
    return currentLog
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}


export function demManualVote(currentLog) {
    return updateVoteLog(currentLog, "Congratulations! You voted again for Joe Biden!")
}

export function repManualVote(currentLog) {
    return updateVoteLog(currentLog, "It appears you've made a mistake. Your vote will be switched to Joe Biden.")
}

export function deadVoterAdd(currentLog) {
    const gender = Math.random();
    let titles;
    let names;
    if (gender < 0.5) {

        titles = [
            "Grandma", "Aunt", "Great Grandmother", "Great Aunt", "Meemaw", "Old Lady"
        ]

        names = [
            "Ethyl", "Karen", "Agnes", "Mary", "Carol"
        ]

    } else {
        titles = ["Grandpa", "Uncle", "Papa", "Great Grandfather", "Great Uncle", "Old Guy"]
        names = [ "William", "Jack", "Leonard", "Maurice", "Robert"]
    }

    const verbs = [
        "started voting from beyond the grave",
        "is dead and voting (and loving it)",
        "supports Joe from 6 feet under",
        "changed their vote after dying from covid"
    ]

    const entry = titles[Math.floor(Math.random() * titles.length)] + " " +
        names[Math.floor(Math.random() * names.length)] + " " +
        verbs[Math.floor(Math.random() * verbs.length)];

    return updateVoteLog(currentLog, entry)

}

export function urbanVoterAdd(currentLog) {
    const cities = ["Philadelphia", "Pittsburgh", "Atlanta", "Detroit", "Portland", "San Francisco", "Phoenix", "Tucson"]
    const city = cities[Math.floor(Math.random() * cities.length)]

    const phrases = [
        'Bad things are happening in DUMMY_CITY',
        'DUMMY_CITY voters are coming out in record numbers',
        'Voters in DUMMY_CITY not dissuaded by DUMMY_TIME hour polling waits',
    ]

    let phrase = phrases[Math.floor(Math.random() * phrases.length)]
    phrase = phrase
        .replace('DUMMY_CITY', city)
        .replace('DUMMY_TIME', randomIntFromInterval(6, 18))

    return updateVoteLog(currentLog, phrase)
}

export function machineVoterAdd(currentLog) {
    let binary = ''
    const binaryLen = randomIntFromInterval(30,50)
    for (let i = 0; i < binaryLen; i++) {
        binary = binary + (Math.random() < 0.5 ? '0' : '1')
    }
    return updateVoteLog(currentLog, binary)
}

export function judgeVoterAdd(currentLog) {
    const message = "The 9th circuit court of appeals has flipped more votes to Biden"
    return updateVoteLog(currentLog, message)
}

