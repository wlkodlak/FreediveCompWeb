import moment from 'moment';

class NewRaceSetupGenerator {
  constructor(raceId, settings) {
    this.raceId = raceId;
    this.raceSettings = settings.raceSettings;
    this.athleteCategories = settings.athleteCategories;
    this.staSettings = settings.staSettings;
    this.dynSettings = settings.dynSettings;
    this.cwtSettings = settings.cwtSettings;
  }

  buildRaceSetupDto() {
    return {
      "Race": this.buildRaceSettings(),
      "StartingLanes": this.buildStartingLanes(),
      "Disciplines": this.buildDisciplines(),
      "ResultsLists": this.buildResultLists()
    };
  }

  buildRaceSettings() {
    return {
      "RaceId": this.raceId,
      "Name": this.raceSettings.name,
      "Start": moment(this.raceSettings.since).startOf('day').format(),
      "End": moment(this.raceSettings.until).endOf('day').format()
    };
  }

  buildStartingLanes() {
    const allLanes = [];

    if (this.staSettings.lanes > 0) {
      const staDimensions = [
        this.buildStaEquipmentDimension(),
        this.buildCategoriesDimension(this.staSettings, true),
        this.buildLanesCountDimension(this.staSettings)
      ];
      this.buildStartingLanesFromDimensions(null, allLanes, staDimensions);
    }

    if (this.dynSettings.lanes > 0) {
      const dynDimensions = [
        this.buildDynEquipmentDimension(this.dynSettings, true),
        this.buildCategoriesDimension(this.dynSettings, true),
        this.buildLanesCountDimension(this.dynSettings)
      ];
      this.buildStartingLanesFromDimensions(null, allLanes, dynDimensions);
    }

    if (this.cwtSettings.lanes > 0) {
      const cwtDimensions = [
        this.buildCwtEquipmentDimension(this.cwtSettings, true),
        this.buildCategoriesDimension(this.cwtSettings, true),
        this.buildLanesCountDimension(this.cwtSettings)
      ];
      this.buildStartingLanesFromDimensions(null, allLanes, cwtDimensions);
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
    if (equipmentDimension.length === 0) equipmentDimension.push("DYN");
    return equipmentDimension;
  }

  buildCwtEquipmentDimension(settings, forStart) {
    if (forStart && !settings.separateEquipment) return ["CWT"];
    const equipmentDimension = [];
    if (settings.disciplineNoFins) equipmentDimension.push("CNF");
    if (settings.disciplineAnyFins) equipmentDimension.push("CWT");
    if (settings.disciplineBiFins) equipmentDimension.push("CWT-bi");
    if (equipmentDimension.length === 0) equipmentDimension.push("CWT");
    return equipmentDimension;
  }

  buildCategoriesDimension(settings, forStart) {
    if (forStart && !settings.separateCategories) return [null];
    const athleteCategories = this.athleteCategories;
    if (athleteCategories.length === 0) return [null];
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
    if (dimensions.length === 0) return;
    const dimension = dimensions[0];
    const nextDimensions = dimensions.slice(1);
    if (dimension.length === 1 && parentId != null) {
      const thisId = dimension[0];
      if (thisId == null) {
        // skip this dimension completely
        this.buildStartingLanesFromDimensions(parentId, targetList, nextDimensions);
      } else {
        this.buildStartingLanesFromDimensions(parentId + "-" + thisId, targetList, nextDimensions);
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
        this.buildStartingLanesFromDimensions(laneId, subList, nextDimensions);
      }
    }
  }

  buildDisciplines() {
    const disciplines = [];

    if (this.staSettings.lanes > 0) {
      this.buildDisciplinesFromDimensions(
        disciplines,
        this.buildStaEquipmentDimension(),
        this.buildCategoriesDimension(this.staSettings, false),
        this.buildSexDimension(),
        this.staSettings.rules);
    }

    if (this.dynSettings.lanes > 0) {
      this.buildDisciplinesFromDimensions(
        disciplines,
        this.buildDynEquipmentDimension(this.dynSettings, false),
        this.buildCategoriesDimension(this.dynSettings, false),
        this.buildSexDimension(),
        this.dynSettings.rules);
    }

    if (this.cwtSettings.lanes > 0) {
      this.buildDisciplinesFromDimensions(
        disciplines,
        this.buildCwtEquipmentDimension(this.cwtSettings, false),
        this.buildCategoriesDimension(this.cwtSettings, false),
        this.buildSexDimension(),
        this.cwtSettings.rules);
    }

    return disciplines;
  }

  buildDisciplinesFromDimensions(disciplines, names, categories, sexes, rules) {
    for (const name of names) {
      for (const category of categories) {
        for (const sex of sexes) {
          const disciplineId = this.buildDisciplineName("-", [name, category, sex]);
          const longName = this.buildDisciplineName("-", [name, category, sex]);
          disciplines.push({
            "DisciplineId": disciplineId,
            "ShortName": name,
            "LongName": longName,
            "Rules": rules,
            "AnnouncementsClosed": false,
            "Category": category,
            "Sex": this.buildSex(sex)
          });
        }
      }
    }
  }

  buildSex(sexName) {
    if (sexName === "Men") return "Male";
    if (sexName === "Women") return "Female";
    return null;
  }

  buildDisciplineName(separator, elements) {
    let name = "";
    let first = true;
    for (const element of elements) {
      if (!element) continue;
      if (!first) name += separator;
      name += element;
      first = false;
    }
    return name;
  }

  buildResultLists() {
    const resultLists = [];
    const categories = this.buildCategoriesDimension(null, false);
    const sexes = this.buildSexDimension();

    for (const category of categories) {
      for (const sex of sexes) {
        const listId = this.buildDisciplineName("-", [category, sex]);
        const listTitle = this.buildDisciplineName(" ", [category, sex]);
        const listColumns = [];
        this.buildResultListColumn(
          listColumns, this.staSettings, "STA", category, sex,
          this.buildStaEquipmentDimension());
        this.buildResultListColumn(
          listColumns, this.dynSettings, "DYN", category, sex,
          this.buildDynEquipmentDimension(this.dynSettings, false));
        this.buildResultListColumn(
          listColumns, this.cwtSettings, "CWT", category, sex,
          this.buildDynEquipmentDimension(this.cwtSettings, false));

        if (listColumns.length > 0) {
          this.buildResultListTotals(listColumns);

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
    if (settings.lanes === 0) return;
    if (!settings.rules.startsWith("AIDA_")) return;

    const components = disciplines.map(name => {
      const disciplineId = this.buildDisciplineName("-", [name, category, sex]);
      return { "DisciplineId": disciplineId };
    });

    listColumns.push({
      "Title": title,
      "IsFinal": false,
      "Components": components
    });
  }

  buildResultListTotals(listColumns) {
    let components = [];
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
