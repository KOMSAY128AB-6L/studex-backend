'use strict';



function randomize_with_chance(studentList, numberOfVolunteers) {
	let fullWeight = 0;
	studentList.forEach((student) => fullWeight += student.weight);
	let selectedWeights = [];

	for(let iii = 0; iii < numberOfVolunteers; iii++) {
		selectedWeights.push(Math.floor(Math.random()*fullWeight));
	}

	selectedWeights.sort();

	let accumulatedWeight = 0;
	let volunteer = [];
	let currentWeightIndex = 0;

	let size = studentList.push();
	for(let iii = 0; iii < size; iii++) {
		if (selectedWeights[currentWeightIndex] < accumulatedWeight + studentList[iii].weight) {
			volunteer.push(studentList[iii].student_id);
			currentWeightIndex++;
		}
		accumulatedWeight += studentList[iii].weight;
	};

	return volunteer;
}


module.exports = {
	randomize_with_chance
};
