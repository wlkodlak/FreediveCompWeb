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
    const highlighted = !cardResult || cardResult === expected;
    const colorClass = "enterresult-" + nameBase + "-card enterresult-card-";
    const selectionClass = highlighted
      ? "selected"
      : "unselected";
    return colorClass + " " + selectionClass;
  }

  render() {
    const selectedCard = this.props.result.CardResult;
    const classesWhite = this.cardClasses(selectedCard, "White", "white");
    const classesYellow = this.cardClasses(selectedCard, "Yellow", "yellow");
    const classesRed = this.cardClasses(selectedCard, "Red", "red");
    return (
      <div className="enterresult-cards">
        <button className={classesWhite} onClick={this.onWhiteClick}>White</button>
        <button className={classesYellow} onClick={this.onYellowClick}>Yellow</button>
        <button className={classesRed} onClick={this.onRedClick}>Red</button>
      </div>
    );
  }
}

export default EnterResultCard;
