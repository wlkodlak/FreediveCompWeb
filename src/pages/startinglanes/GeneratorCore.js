class GeneratorCore {
  constructor(settings, allStartingLanes, athletes) {
    this.startingLanes = this.getLeafLanes(allStartingLanes, settings.selectedStartingLane);
    this.disciplines = settings.selectedDisciplines;
    this.startInterval = settings.startInterval;
    this.breakInterval = settings.breakInterval;
    this.maximumTimeSinceBreak = settings.breakInterval - settings.breakDuration - settings.startInterval;
    this.firstStart = settings.firstStart.getTime();
    this.athletes = athletes;
  }

  getLeafLanes(startingLanes, parentLaneId) {
    for (const lane of startingLanes) {
      if (lane.value !== parentLaneId) continue;
      if (lane.rawLane.SubLanes && lane.rawLane.SubLanes.length > 1) {
        const leafLanes = [];
        this.buildLeafLanes(leafLanes, lane.rawLane.SubLanes);
        return leafLanes;
      } else {
        return [parentLaneId];
      }
    }
    return [parentLaneId];
  }

  buildLeafLanes(output, inputs) {
    for (const input of inputs) {
      if (input.SubLanes && input.SubLanes.length > 0) {
        this.buildLeafLanes(output, input.SubLanes);
      } else {
        output.push(input.StartingLaneId);
      }
    }
  }

  buildStartListEntries() {
    this.startingList = [];
    this.timeOffset = 0;
    this.timeSinceBreak = 0;
    this.laneIndex = 0;

    for (const athlete of this.athletes) {
      for (const announcement of athlete.Announcements) {
        if (this.disciplines.includes(announcement.DisciplineId)) {
          this.startingList.push({
            athleteId: athlete.Profile.AthleteId,
            disciplineId: announcement.DisciplineId,
            duration: this.extractDuration(announcement.Performance),
            distance: this.extractDistance(announcement.Performance),
            depth: this.extractDepth(announcement.Performance),
            startingLaneId: null,
            officialTop: null
          });
        }
      }
    }

    this.startingList.sort(this.compareAnnouncements);

    for (const entry of this.startingList) {
      entry.startingLaneId = this.startingLanes[this.laneIndex];
      entry.officialTop = new Date(this.firstStart + this.timeOffset * 60000);
      this.moveToNextStart();
    }

    return this.startingList.map(entry => ({
      "AthleteId": entry.athleteId,
      "DisciplineId": entry.disciplineId,
      "StartingLaneId": entry.startingLaneId,
      "OfficialTop": entry.officialTop.toISOString()
    }));
  }

  extractDuration(performance) {
    if (typeof performance !== "object") return 0;
    if (typeof performance.Duration !== "string") return 0;
    let duration = 0;
    for (const part of performance.Duration.split(":")) {
      duration = duration * 60 + parseInt(part, 10);
    }
    return duration;
  }

  extractDistance(performance) {
    if (typeof performance !== "object") return 0;
    if (typeof performance.Distance !== "number") return 0;
    return performance.Distance;
  }

  extractDepth(performance) {
    if (typeof performance !== "object") return 0;
    if (typeof performance.Depth !== "number") return 0;
    return performance.Depth;
  }

  compareAnnouncements(a, b) {
    if (a.duration !== b.duration) return a.duration - b.duration;
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (a.depth !== b.depth) return a.depth - b.depth;
    return 0;
  }

  moveToNextStart() {
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

export default GeneratorCore;
