class NewRaceSetupGenerator {
  constructor NewRaceSetupGenerator(raceId, settings) {
    this.raceId = raceId;
    this.raceSettings = settings.raceSettings;
    this.athleteCategories = settings.athleteCategories;
    this.staSettings = settings.staSettings;
    this.dynSettings = settings.dynSettings;
    this.cwtSettings = settings.cwtSettings;
  }

  buildRaceSetupDto() {
    return {
      "Race": buildRaceSettings(),
      "StartingLanes": buildStartingLanes(),
      "Disciplines": buildDisciplines(),
      "ResultLists": buildResultLists()
    };
  }

  buildRaceSettings() {
    return {
      "RaceId": this.raceId,
      "Name": this.raceSettings.name,
      "Start": this.raceSettings.since,
      "End": this.raceSettings.until
    };
  }

  buildStartingLanes() {
    const allLanes = [];

    if (this.staSettings.lanes > 0) {
      const staDimensions = [
        buildStaEquipmentDimension(),
        buildCategoriesDimension(this.staSettings, true),
        buildLanesCountDimension(this.staSettings)
      ];
      buildStartingLanesFromDimensions(allLanes, staDimensions);
    }

    if (this.dynSettings.lanes > 0) {
      const dynDimensions = [
        buildDynEquipmentDimension(this.dynSettings, true),
        buildCategoriesDimension(this.dynSettings, true),
        buildLanesCountDimension(this.dynSettings)
      ];
      buildStartingLanesFromDimensions(allLanes, dynDimensions);
    }

    if (this.cwtSettings.lanes > 0) {
      const cwtDimensions = [
        buildCwtEquipmentDimension(this.cwtSettings, true),
        buildCategoriesDimension(this.cwtSettings, true),
        buildLanesCountDimension(this.cwtSettings)
      ];
      buildStartingLanesFromDimensions(allLanes, cwtDimensions);
    }

    return allLanes;
  }

  buildStaEquipmentDimension() {
    return ["STA"];
  }

  buildDynEquipmentDimension(settings, forStart) {
    if (forStart && !settings.separateEquipment) return ["DYN"];
    const equipmentDimension = [];
    if (settings.disciplineNoFins) equipmentDimension.push("DNF");
    if (settings.disciplineAnyFins) equipmentDimension.push("DYN");
    if (settings.disciplineBiFins) equipmentDimension.push("DYN-bi");
    if (equipmentDimension.length == 0) equipmentDimension.push("DYN");
    return equipmentDimension;
  }

  buildCwtEquipmentDimension(settings, forStart) {
    if (forStart && !settings.separateEquipment) return ["CWT"];
    const equipmentDimension = [];
    if (settings.disciplineNoFins) equipmentDimension.push("CNF");
    if (settings.disciplineAnyFins) equipmentDimension.push("CWT");
    if (settings.disciplineBiFins) equipmentDimension.push("CWT-bi");
    if (equipmentDimension.length == 0) equipmentDimension.push("CWT");
    return equipmentDimension;
  }

  buildCategoriesDimension(settings, forStart) {
    if (!forStart && settings && settings.separateCategories) return [null];
    const athleteCategories = this.athleteCategories;
    if (athleteCategories.length == 0) return [null];
    return athleteCategories;
  }

  buildLanesCountDimension(settings) {
    if (settings.lanes <= 1) return [null];
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    return letters.slice(0, settings.lanes);
  }

  buildSexDimension() {
    return ["Men", "Women"];
  }

  buildStartingLanesFromDimensions(parentId, targetList, dimensions) {
    if (dimensions.length == 0) return;
    const dimension = dimensions[0];
    const nextDimensions = dimensions.slice(1);
    if (dimension.length == 1 && parentId != null) {
      const thisId = dimension[0];
      if (thisId == null) {
        // skip this dimension completely
        buildStartingLanesFromDimensions(parentId, targetList, nextDimensions);
      } else {
        buildStartingLanesFromDimensions(parentId + "-" + thisId, targetList, nextDimensions);
      }
    } else {
      for (const name of dimension) {
        const laneId = parentId == null ? name : parentId + "-" + name;
        const subList = [];
        targetList.push({
          "StartingLaneId": laneId,
          "ShortName": name,
          "SubLanes": subList
        });
        buildStartingLanesFromDimensions(laneId, subList, nextDimensions);
      }
    }
  }

  buildDisciplines() {
    const disciplines = [];

    if (this.staSettings.lanes > 0) {
      buildDisciplinesFromDimensions(
        disciplines,
        buildStaEquipmentDimension(),
        buildCategoriesDimension(this.staSettings, false),
        buildSexDimension(),
        this.staSettings.rules);
    }

    if (this.dynSettings.lanes > 0) {
      buildDisciplinesFromDimensions(
        disciplines,
        buildDynEquipmentDimension(this.dynSettings, false),
        buildCategoriesDimension(this.dynSettings, false),
        buildSexDimension(),
        this.dynSettings.rules);
    }

    if (this.cwtSettings.lanes > 0) {
      buildDisciplinesFromDimensions(
        disciplines,
        buildCwtEquipmentDimension(this.cwtSettings, false),
        buildCategoriesDimension(this.cwtSettings, false),
        buildSexDimension(),
        this.cwtSettings.rules);
    }

    return disciplines;
  }

  buildDisciplinesFromDimensions(disciplines, names, categories, sexes, rules) {
    for (const name of names) {
      for (const category of categories) {
        for (const sex of sexes) {
          const disciplineId = buildDisciplineName("-", [name, category, sex]);
          const longName = buildDisciplineName("-", [name, category, sex]);
          disciplines.push({
            "DisciplineId": disciplineId,
            "ShortName": name,
            "LongName": longName,
            "Rules": rules,
            "AnnouncementsClosed": false
          });
        }
      }
    }
  }

  buildDisciplineName(separator, elements) {
    let name = "";
    let first = true;
    for (const element of elements) {
      if (!first) name += separator;
      name += element;
      first = false;
    }
    return name;
  }

  buildResultLists() {
    const resultLists = [];
    const categories = buildCategoriesDimension(null, false);
    const sexes = buildSexDimension();

    for (const category of categories) {
      for (const sex of sexes) {
        const listId = buildDisciplineName("-", [category, sex]);
        const listTitle = buildDisciplineName(" ", [category, sex]);
        const listColumns = [];
        buildResultListColumn(
          listColumns, this.staSettings, "STA", category, sex,
          buildStaEquipmentDimension());
        buildResultListColumn(
          listColumns, this.dynSettings, "DYN", category, sex,
          buildDynEquipmentDimension(this.dynSettings, false));
        buildResultListColumn(
          listColumns, this.cwtSettings, "CWT", category, sex,
          buildDynEquipmentDimension(this.cwtSettings, false));

        if (listColumns.length > 0) {
          buildResultListTotals(listColumns);

          resultLists.push({
            "ResultsListId": listId,
            "Title": listTitle,
            "Columns": listColumns
          });
        }
      }
    }

    return resultLists;
  }

  buildResultListColumn(listColumns, settings, title, category, sex, disciplines) {
    if (settings.lanes == 0) return;
    if (!settings.rules.startsWith("AIDA-")) return;

    const components = disciplines.map(name => {
      const disciplineId = buildDisciplineName("-", [name, category, sex]);
      return { "DisciplineId": disciplineId };
    });

    listColumns.push({
      "Title": title,
      "IsFinal": false,
      "Components": components
    });
  }

  buildResultListTotals(listColumns) {
    const components = [];
    for (const column of listColumns) {
      components = components.concat(column["Components"]);
    }
    listColumns.push({
      "Title": "Total",
      "IsFinal": true,
      "Components": components
    });
  }
}

export default NewRaceSetupGenerator;
