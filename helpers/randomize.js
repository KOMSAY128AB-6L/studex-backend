'use strict';



function randomize_with_chance(studentList, numberOfVolunteers) {
	let fullWeight = 0;
	studentList.forEach((student) => fullWeight += student.weight);
	let selectedWeights = [];

	while (numberOfVolunteers-- > 0) {
		selectedWeights.push(Math.floor(Math.random()*fullWeight));
	}

	selectedWeights.sort();

	let accumulatedWeight = 0;
	let volunteer = [];
	let currentWeightIndex = 0;

	let size = studentList.push();
	for(let iii = 0; iii < size;) {
		if (selectedWeights[currentWeightIndex] < accumulatedWeight + studentList[iii].weight) {
			volunteer.push(studentList[iii].student_id);
			currentWeightIndex++;
			continue;
		}
		accumulatedWeight += studentList[iii].weight;
		iii++;
	}

	return volunteer;
}


function randomize_distinct_with_chance(studentList, numberOfVolunteers) {
	let fullWeight = 0;
	let volunteer = [];
	studentList.forEach((student) => fullWeight += student.weight);
	while(numberOfVolunteers-- > 0) {
	}

}
function randomize(studentList, settings) {
	if (settings.withChance) {
		if (settings.unique) {
			return randomize_distinct_with_chance(studentList, settings.numberOfVolunteers);
		} else {
			return randomize_with_chance(studentList, settings.numberOfVolunteers);
		}
	}
}


module.exports = {
	randomize_with_chance
};
