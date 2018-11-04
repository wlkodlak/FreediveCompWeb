export default class AthleteStartExtractor {
  getStartsForDiscipline(discipline, athletes) {
    const athleteStarts = [];
    for (const athlete of athletes) {
      for (const announcement of athlete.Announcements) {
        athleteStarts.push({
          Athlete: athlete.Profile,
          Discipline: discipline,
          Announcement: announcement.Performance,
          AthleteId: athlete.Profile.AthleteId,
          AthleteFullName: `${athlete.Profile.FirstName} ${athlete.Profile.Surname}`,
          DisciplineName: discipline.ShortName,
          AnnouncedDuration: PerformanceComponent.Duration.extractFrom(announcement.Performance),
          AnnouncedDistance: PerformanceComponent.Distance.extractFrom(announcement.Performance),
          AnnouncedDepth: PerformanceComponent.Depth.extractFrom(announcement.Performance)
        });
      }
    }
    return athleteStarts;
  }

  sortStarts(athleteStarts) {
    athleteStarts.sort(this.compareAthleteStarts);
  }

  compareAthleteStarts(a, b) {
    if (a.AnnouncedDepth !== b.AnnouncedDepth) return a.AnnouncedDepth - b.AnnouncedDepth;
    if (a.AnnouncedDistance !== b.AnnouncedDistance) return a.AnnouncedDistance - b.AnnouncedDistance;
    if (a.AnnouncedDuration !== b.AnnouncedDuration) return a.AnnouncedDuration - b.AnnouncedDuration;
    return 0;
  }
}
