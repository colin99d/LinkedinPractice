import React, { Component } from 'react';
import './App.css';

import Block from "./components/block.js"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: null,
      active: 0,
    }
    this.createFeed = this.createFeed.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  createFeed() {
    var squares = []
    Array(10).fill().forEach(item => {
      let holder = [];
      Array(10).fill().forEach(item => {
        if (Math.random() >0.2) {
          holder.push([0,]);
        } else {
          holder.push([1,]);
        }
        
      })
      if(squares.length >0) {
        squares.push(holder)
      } else {
        squares = [holder,]
      }
    })
    this.setState({squares:squares})
  }

  getCount(coord){
    var original = [...this.state.squares]
    var surrounding = [];
    for (let i=-1; i<2; i++){
      for (let j=-1; j<2; j++) {
        if(coord[0]+i >= 0 && coord[0]+i <= 9 && coord[1]+j >= 0 && coord[1]+j <= 9 && !(i === 0 && j === 0)) {
          surrounding.push([coord[0]+i, coord[1]+j])
        }
      }
    }
    var count = 0;
    for (let k=0; k<surrounding.length; k++) {
      let selection = surrounding[k]
      if(this.state.squares[selection[0]][selection[1]][0] === 1 || this.state.squares[selection[0]][selection[1]][0] === 3) {
        count ++
      }
    }
    original[coord[0]][coord[1]][1] = count
    this.setState({squares:original})
    return [count, surrounding]
  }

  handleClick(coord) {
    var original = [...this.state.squares]
    if (original[coord[0]][coord[1]][0] === 0) {
      original[coord[0]][coord[1]][0] = 2;
      var [count, surrounding] = this.getCount(coord, surrounding);
      if(count === 0) {
        for(let i=0; i<surrounding.length; i++) {
          var newCount = this.getCount(surrounding[i])
          
        }
      } 
    } else if (original[coord[0]][coord[1]][0] === 1) {
      original[coord[0]][coord[1]][0] = 3;
    }
    this.setState({squares:original})
  }

  componentDidMount() {
    this.createFeed();
  }

  render() {
    
    return (
      <div>
        <h1 className="title">Minesweeper Game</h1>
        <table className="board">
          <tbody>
            {this.state.squares ? this.state.squares.map((item,idx) =>
              <tr key={idx}>
                {this.state.squares[idx].map((item2, idx2) => 
                  <Block key={idx+"-"+idx2} type={this.state.squares[idx][idx2][0]} coords={[idx,idx2]} handleClick={this.handleClick} count={this.state.squares[idx][idx2][1]}/>
                )}
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App;
