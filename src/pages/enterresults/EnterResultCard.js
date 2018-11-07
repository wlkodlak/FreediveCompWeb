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

  cardClasses(cardResult, suggestedResult, expected, nameBase) {
    const cssClasses = [];
    cssClasses.push("enterresults-" + nameBase + "-card");
    if (cardResult === expected) {
      cssClasses.push("enterresults-card-selected");
    } else {
      cssClasses.push("enterresults-card-unselected");
    }
    if (suggestedResult === expected) {
      cssClasses.push("enterresults-card-suggested");
    } else {
      cssClasses.push("enterresults-card-unsuggested");
    }
    return cssClasses.join(" ");
  }

  getSelectedCard() {
    return this.props.result.CardResult;
  }

  getSuggestedCard() {
    if (!this.props.result) return null;
    if (!this.props.result.Penalizations) return null;
    let level = 0;
    for (const penalization of this.props.result.Penalizations) {
      let suggested;
      if (penalization.CardResult === "Red") {
        suggested = 2;
      } else {
        suggested = 1;
      }
      level = Math.max(level, suggested);
    }
    return ["White", "Yellow", "Red"][level];
  }

  render() {
    const selectedCard = this.getSelectedCard();
    const suggestedCard = this.getSuggestedCard();
    const classesWhite = this.cardClasses(selectedCard, suggestedCard, "White", "white");
    const classesYellow = this.cardClasses(selectedCard, suggestedCard, "Yellow", "yellow");
    const classesRed = this.cardClasses(selectedCard, suggestedCard, "Red", "red");
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
