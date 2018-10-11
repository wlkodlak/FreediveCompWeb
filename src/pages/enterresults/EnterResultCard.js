import React from 'react';

class EnterResultCard extends React.Component {
  constructor(props) {
    super(props);
    this.onWhiteClick = this.onWhiteClick.bind(this);
    this.onYellowClick = this.onYellowClick.bind(this);
    this.onRedClick = this.onRedClick.bind(this);
  }

  onWhiteClick() {
    this.props.onCardSelected("White");
  }

  onYellowClick() {
    this.props.onCardSelected("Yellow");
  }

  onRedClick() {
    this.props.onCardSelected("Red");
  }

  cardClasses(cardResult, expected, nameBase) {
    const highlighted = cardResult === expected;
    const colorClass = "enterresults-" + nameBase + "-card enterresults-card-";
    const selectionClassSuffix = highlighted
      ? "selected"
      : "unselected";
    return colorClass + selectionClassSuffix;
  }

  render() {
    const selectedCard = this.props.result.CardResult;
    const classesWhite = this.cardClasses(selectedCard, "White", "white");
    const classesYellow = this.cardClasses(selectedCard, "Yellow", "yellow");
    const classesRed = this.cardClasses(selectedCard, "Red", "red");
    return (
      <div className="enterresults-cards">
        <button type="button" className={classesWhite} onClick={this.onWhiteClick}>White</button>
        <button type="button" className={classesYellow} onClick={this.onYellowClick}>Yellow</button>
        <button type="button" className={classesRed} onClick={this.onRedClick}>Red</button>
      </div>
    );
  }
}

export default EnterResultCard;
