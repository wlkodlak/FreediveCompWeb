const formatDurationPerformance = performance => {
  if (typeof performance === "object" && typeof performance.Duration === "string") {
    return performance.Duration.substring(3);
  } else {
    return "";
  }
};

const formatDistancePerformance = performance => {
  if (typeof performance === "object" && typeof performance.Distance === "number") {
    return `${performance.Distance}m`;
  } else {
    return "";
  }
}

const formatDepthPerformance = performance => {
  if (typeof performance === "object" && typeof performance.Depth === "number") {
    return `${performance.Depth}m`;
  } else {
    return "";
  }
}

const formatPointsPerformance = performance => {
  if (typeof performance === "object" && typeof performance.Points === "number") {
    return `${performance.Points}`;
  } else {
    return "";
  }
}

const formatPerformance = performance => {
  if (typeof performance === "object") {
    if (typeof performance.Duration === "string") {
      return performance.Duration.substring(3);
    } else if (typeof performance.Distance === "number") {
      return `${performance.Distance}m`;
    } else if (typeof performance.Depth === "number") {
      return `${performance.Depth}m`;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

export { formatPerformance, formatPointsPerformance, formatDurationPerformance, formatDistancePerformance, formatDepthPerformance };
