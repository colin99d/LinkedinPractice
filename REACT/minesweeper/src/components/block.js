import React, { Component } from 'react';
import './block.css';

class Block extends Component {

  render() {
      var blockShow;
      if(this.props.type === 0 || this.props.type === 1) {
        blockShow = "block-unknown"
      } else if (this.props.type === 2) {
        blockShow = "block-known"
      } else if (this.props.type === 3) {
        blockShow = "block-bomb"
      }
    return (
      <td className={blockShow} onClick={() => this.props.handleClick(this.props.coords)}>{this.props.count>0 ? this.props.count : ""}</td>
    )
  }
}

export default Block;
