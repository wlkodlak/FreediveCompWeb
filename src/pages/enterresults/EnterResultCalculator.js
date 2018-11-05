import Api from '../../api/Api';

export class EnterResultCalculation {
  constructor(rules, announced, realized, resolve, reject) {
    this.rules = rules;
    this.announced = announced;
    this.realized = realized;
    this.resolve = resolve;
    this.reject = reject;

    this.points = null;
    this.shortPenalization = null;

    this.onPointsCalculated = this.onPointsCalculated.bind(this);
    this.onShortCalculated = this.onShortCalculated.bind(this);
  }

  run() {
    if (this.rules.HasPoints) {
      this.calculatePoints();
    } else {
      this.calculateShortPenalization();
    }
  }

  calculatePoints() {
    Api.postGlobalRulePoints(this.rules.Name, this.realized).then(this.onPointsCalculated).catch(this.reject);
  }

  calculateShortPenalization() {
    const request = {
      Announced: this.announced,
      Realized: this.realized
    };
    Api.postGlobalRuleShort(this.rules.Name, request).then(this.onShortCalculated).catch(this.reject);
  }

  onPointsCalculated(points) {
    this.points = points;
    this.calculateShortPenalization();
  }

  onShortCalculated(penalization) {
    this.shortPenalization = penalization;
    this.sendResult();
  }

  sendResult() {
    this.resolve({calculation: this, points: this.points, shortPenalization: this.shortPenalization});
  }
}

export default class EnterResultCalculator {
  constructor(resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;

    this.onResolved = this.onResolved.bind(this);
    this.onRejected = this.onRejected.bind(this);
  }

  calculate(rules, announced, realized) {
    const newCalculation = new EnterResultCalculation(rules, announced, realized, this.onResolved, this.onRejected);
    this.cancelled = false;
    if (this.busy) {
      this.pending = newCalculation;
    } else {
      this.busy = newCalculation;
      this.busy.run();
    }
  }

  cancel() {
    if (this.busy) {
      this.cancelled = true;
    }
  }

  onResolved(result) {
    if (this.pending) {
      this.busy = this.pending;
      this.pending = null;
      this.busy.run();
    } else if (this.cancelled) {
      this.busy = null;
      this.cancelled = false;
    } else {
      this.busy = null;
      this.resolve(result);
    }
  }

  onRejected(error) {
    if (this.pending) {
      this.busy = this.pending;
      this.pending = false;
      this.busy.run();
    } else if (this.cancelled) {
      this.busy = null;
      this.cancelled = false;
    } else {
      this.busy = null;
      this.reject(error);
    }
  }
}
