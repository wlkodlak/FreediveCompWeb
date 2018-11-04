export default class StartingLanesFlattener {
  getFlattenedStartingLanes(startingLanes) {
    const flattened = [];
    this.flattenLanes(flattened, 1, startingLanes);
    return flattened;
  }

  flattenLanes(flattened, level, startingLanes) {
    if (!startingLanes) return;
    for (const startingLane of startingLanes) {
      flattened.push({
        ...startingLane,
        Level: level
      });
      this.flattenLanes(flattened, level + 1, startingLane.SubLanes);
    }
  }
}
