export default class StartSlotGenerator {
  constructor(settings, startingLanes) {
    this.startingLanes = this.getLeafLanes(startingLanes, settings.selectedStartingLane);

    this.startInterval = settings.startInterval;
    this.breakInterval = settings.breakInterval;
    this.maximumTimeSinceBreak = settings.breakInterval - settings.breakDuration - settings.startInterval;
    this.firstStart = settings.firstStart.getTime();

    this.position = 0;
    this.timeOffset = 0;
    this.timeSinceBreak = 0;
    this.laneIndex = 0;
  }

  getLeafLanes(startingLanes, parentLaneId) {
    for (const lane of startingLanes) {
      if (lane.StartingLaneId !== parentLaneId) continue;
      if (lane.SubLanes && lane.SubLanes.length > 1) {
        const leafLanes = [];
        this.buildLeafLanes(leafLanes, lane.SubLanes);
        return leafLanes;
      } else {
        return [lane];
      }
    }
    return [];
  }

  buildLeafLanes(output, inputs) {
    for (const input of inputs) {
      if (input.SubLanes && input.SubLanes.length > 0) {
        this.buildLeafLanes(output, input.SubLanes);
      } else {
        output.push(input);
      }
    }
  }

  generate() {
    const slot = {
      Position: this.position,
      OfficialTop: new Date(this.firstStart + this.timeOffset * 60000),
      StartingLaneId: this.startingLanes[this.laneIndex].StartingLaneId,
      StartingLaneName: this.startingLanes[this.laneIndex].ShortName,
      AssignedAthleteStart: null
    };
    this.moveToNextStart();
    return slot;
  }

  moveToNextStart() {
    this.position++;
    this.laneIndex++;
    if (this.laneIndex < this.startingLanes.length) return; // no time travel needed
    this.laneIndex = 0;
    this.timeOffset += this.startInterval;
    this.timeSinceBreak += this.startInterval;
    if (this.timeSinceBreak <= this.maximumTimeSinceBreak) return;  // no break yet
    const breakDuration = this.breakInterval - this.timeSinceBreak;
    this.timeOffset += breakDuration;
    this.timeSinceBreak = 0;
  }
}
