function repeatString(input, count) {
  if (count === 0) {
    return "";
  }
  if (count === 1) {
    return input;
  }
  let result = input;
  for (let i = 1; i < count; i++) {
    result = result + input;
  }
  return result;
}

function formatPaddedInteger(value, digits) {
  const unpadded = value.toString();
  const padding = repeatString("0", digits - unpadded.length);
  return padding + unpadded;
}

export function extractDurationFrom(performance) {
  if (performance && typeof performance.Duration === "string" && performance.Duration.length === 8) {
    const minutes = parseInt(performance.Duration.substring(3, 5), 10);
    const seconds = parseInt(performance.Duration.substring(6, 8), 10);
    return minutes * 60 + seconds;
  } else {
    return null;
  }
}

export function saveDurationInto(performance, value) {
  if (!performance) {
    performance = {};
  }
  if (typeof value === "number") {
    performance.Duration = "00:" + formatPaddedInteger(Math.floor(value / 60), 2) + ":" + formatPaddedInteger(value % 60, 2);
  } else if (typeof value === "string") {
    if (value.length === 5) {
      performance.Duration = "00:" + value;
    } else if (value.length === 8) {
      performance.Duration = value;
    } else {
      performance.Duration = null;
    }
  } else {
    performance.Duration = null;
  }
  return performance;
}

export function formatDuration(value, allowUnit) {
  if (typeof value === "number") {
    return formatPaddedInteger(Math.floor(value / 60), 2) + ":" + formatPaddedInteger(value % 60, 2);
  } else if (typeof value === "string") {
    if (value.length <= 5) {
      return value;
    } else {
      return value.substring(value.length - 5);
    }
  } else {
    return "";
  }
}

export function parseDuration(input) {
  const checker = /^([0-9]+:)?([0-9]+)$/;
  if (!checker.test(input)) {
    return null;
  }

  const colonPosition = input.indexOf(":");
  let minutes = 0;
  let seconds = 0;
  if (colonPosition < 0) {
    seconds = parseInt(input, 10);
  } else {
    minutes = parseInt(input.substring(0, colonPosition), 10);
    seconds = parseInt(input.substring(colonPosition + 1), 10);
  }
  if (seconds >= 60) {
    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
  }
  const formattedDuration = "00:" + (
    minutes < 10
      ? "0"
      : ""
  ) + minutes.toString() + ":" + (
    seconds < 10
      ? "0"
      : ""
  ) + seconds.toString();
  return formattedDuration;
}

export function extractDistanceFrom(performance) {
  if (performance) {
    return performance.Distance;
  } else {
    return null;
  }
}

export function saveDistanceInto(performance, value) {
  if (!performance) {
    performance = {};
  }
  if (typeof value === "number") {
    performance.Distance = value;
  } else {
    performance.Distance = null;
  }
}

export function formatDistance(value, allowUnit) {
  return formatNumericComponent(value, allowUnit, "m");
}

export function parseDistance(input) {
  return parseNumericComponent(input);
}

export function extractDepthFrom(performance) {
  if (performance) {
    return performance.Depth;
  } else {
    return null;
  }
}

export function saveDepthInto(performance, value) {
  if (!performance) {
    performance = {};
  }
  if (typeof value === "number") {
    performance.Depth = value;
  } else {
    performance.Depth = null;
  }
}

export function formatDepth(value, allowUnit) {
  return formatNumericComponent(value, allowUnit, "m");
}

export function parseDepth(input) {
  return parseNumericComponent(input);
}

export function extractPointsFrom(performance) {
  if (performance) {
    return performance.Points;
  } else {
    return null;
  }
}

export function savePointsInto(performance, value) {
  if (!performance) {
    performance = {};
  }
  if (typeof value === "number") {
    performance.Points = value;
  } else {
    performance.Points = null;
  }
}

export function formatPoints(value, allowUnit) {
  return formatNumericComponent(value, allowUnit, "p");
}

export function parsePoints(input) {
  return parseNumericComponent(input);
}

function extractUnknownFrom(performance) {
  return null;
}

function saveUnknownInto(performance, value) {
  // noop
}

function formatUnknown(value, allowUnit) {
  return "";
}

function parseUnknown(input) {
  return null;
}

function formatNumericComponent(value, allowUnit, unit) {
  if (typeof value === "number") {
    const suffix = !allowUnit
      ? ""
      : unit || "";
    return value.toString() + suffix;
  } else {
    return "";
  }
}

function parseNumericComponent(input) {
  const checker = /^[0-9]+$/;
  if (!checker.test(input)) {
    return null;
  }
  return parseInt(input, 10);
}

export default class PerformanceComponent {
  constructor(name) {
    this.name = name;
    if (name === "Duration") {
      this.extractor = extractDurationFrom;
      this.setter = saveDurationInto;
      this.formatter = formatDuration;
      this.parser = parseDuration;
      this.placeholder = "mm:ss";
    } else if (name === 'Distance') {
      this.extractor = extractDistanceFrom;
      this.setter = saveDistanceInto;
      this.formatter = formatDistance;
      this.parser = parseDistance;
      this.placeholder = "100";
    } else if (name === 'Depth') {
      this.extractor = extractDepthFrom;
      this.setter = saveDepthInto;
      this.formatter = formatDepth;
      this.parser = parseDepth;
      this.placeholder = "50";
    } else if (name === 'Points') {
      this.extractor = extractPointsFrom;
      this.setter = savePointsInto;
      this.formatter = formatPoints;
      this.parser = parsePoints;
      this.placeholder = "10";
    } else {
      this.extractor = extractUnknownFrom;
      this.setter = saveUnknownInto;
      this.formatter = formatUnknown;
      this.parser = parseUnknown;
      this.placeholder = "";
    }
  }

  extractFrom(performance) {
    return this.extractor(performance);
  }

  saveInto(performance, value) {
    return this.setter(performance, value);
  }

  format(value, allowUnit) {
    if (typeof value === "object") {
      return this.formatter(value[this.name], allowUnit);
    } else {
      return this.formatter(value, allowUnit);
    }
  }

  parse(input) {
    return this.parser(input);
  }

  buildPerformance(value) {
    if (value) {
      return this.setter({}, value);
    } else {
      return null;
    }
  }

  static get Duration() {
    return new PerformanceComponent("Duration");
  }

  static get Distance() {
    return new PerformanceComponent("Distance");
  }

  static get Depth() {
    return new PerformanceComponent("Depth");
  }

  static get Points() {
    return new PerformanceComponent("Points");
  }

  static get Unknown() {
    return new PerformanceComponent("Unknown");
  }

  static autoDetectFrom(performance) {
    if (!performance) {
      return new PerformanceComponent("Unknown");
    } else if (typeof performance.Distance === "number") {
      return new PerformanceComponent("Distance");
    } else if (typeof performance.Depth === "number") {
      return new PerformanceComponent("Depth");
    } else if (typeof performance.Duration === "string") {
      return new PerformanceComponent("Duration");
    } else if (typeof performance.Points === "number") {
      return new PerformanceComponent("Points");
    } else {
      return new PerformanceComponent("Unknown");
    }
  }

  static formatPerformance(performance) {
    const component = PerformanceComponent.autoDetectFrom(performance);
    return component.format(performance, true);
  }

  static findPrimaryForDiscipline(ruleName, allRules) {
    if (allRules) {
      for (const rules of allRules) {
        if (rules.Name === ruleName) {
          return new PerformanceComponent(rules.PrimaryComponent);
        }
      }
    }
    switch (ruleName) {
      case "AIDA_STA":
      case "CMAS_STA":
        return PerformanceComponent.Duration;
      case "AIDA_DYN":
      case "CMAS_DYN":
        return PerformanceComponent.Distance;
      case "AIDA_CWT":
      case "CMAS_CWT":
        return PerformanceComponent.Depth;
      default:
        return PerformanceComponent.Unknown;
    }
  }
}
