'use strict';



function randomize_with_chance(studentList, numberOfVolunteers, fullWeight) {
    if (typeof fullWeight === 'undefined') {
        fullWeight = 0;
        studentList.forEach((student) => fullWeight += student.weight);
    }
    let selectedWeights = [];

    while (numberOfVolunteers-- > 0) {
        selectedWeights.push(Math.floor(Math.random()*fullWeight));
    }

    selectedWeights.sort();

    let accumulatedWeight = 0;
    let volunteer = [];
    let currentWeightIndex = 0;

    for(let iii = 0; iii < studentList.length;) {
        if (selectedWeights[currentWeightIndex] < accumulatedWeight + studentList[iii].weight) {
            volunteer.push(studentList[iii]);
            currentWeightIndex++;
            continue;
        }
        if (accumulatedWeight > fullWeight) {
            accumulatedWeight -= fullWeight;
        }
        accumulatedWeight += studentList[iii].weight;
        iii++;
    }

    return volunteer;
}

function randomize_distinct_with_chance(studentList, numberOfVolunteers, fullWeight) {
    if (typeof fullWeight === 'undefined') {
        fullWeight = 0;
        studentList.forEach((student) => fullWeight += student.weight);
    }
    let volunteer = [];

    let accumulatedWeight;
    let selectedWeight;
    while(numberOfVolunteers-- > 0) {
        selectedWeight = Math.floor(Math.random()*fullWeight);
        accumulatedWeight = 0;
        for(let iii = 0; iii < studentList.length; iii++) {
            if (selectedWeight < accumulatedWeight + studentList[iii].weight) {
                fullWeight -= studentList[iii].weight;
                volunteer.push(studentList.splice(iii,1)[0]);
                break;
            }
            accumulatedWeight += studentList[iii].weight;
        }
    }

    return volunteer;
}

function randomize_distinct(studentList, numberOfVolunteers) {
    let volunteer = [];
    while (numberOfVolunteers-- > 0) {
        volunteer.push(studentList.splice(Math.floor(Math.random()*studentList.length), 1)[0]);
    }

    return volunteer;
}

function randomize_normal(studentList, numberOfVolunteers) {
    let volunteer = [];
    while (numberOfVolunteers-- > 0) {
        volunteer.push(studentList[Math.floor(Math.random()*studentList.length)]);
    }

    return volunteer;
}


const freshWeight = 50; //default weight
const minWeight = 0;
/**
 * All in one randomize function
 * @param1 the list of students to be randomized
    Student's required attributes: student_id
    	required if using randomizing by chance: chance
    	required if randomizing by coung: volunteerCount
 * @param2 the settings to be used for randomization
 **/
function randomize(studentList, settings) {
    
    if (!settings.minWeight) {
        settings.minWeight = minWeight;
    }

    if (!settings.freshWeight) {
        settings.freshWeight = freshWeight;
    }

    let fullWeight;

    if(settings.byCount) {
        studentList.forEach((student) => student.weight = (student.volunteerCount > settings.freshWeight)? settings.minWeight: settings.freshWeight - student.volunteerCount);
        settings.withChance = true;
    } else if (settings.byChance) {
        fullWeight = studentList.length * 100;
        studentList.forEach((student) => student.weight = Math.ceil(fullWeight * student.chance));
        settings.withChance = true;
    }

    if (settings.withChance) {
        if (settings.unique) {
            return randomize_distinct_with_chance(studentList, settings.numberOfVolunteers, fullWeight);
        } else {
            return randomize_with_chance(studentList, settings.numberOfVolunteers, fullWeight);
        }
    } else {
        if (settings.unique) {
            return randomize_distinct(studentList, settings.numberOfVolunteers);
        } else {
            return randomize_normal(studentList, settings.numberOfVolunteers);
        }
    }
}


module.exports = {
    randomize
};
