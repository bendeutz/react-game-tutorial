import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  createSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  createBoard() {
    let board = []
    let index = 0
    let row = 0
    for (let i = 0; i < 3; i++) {
      let children = []
      for (let j = 0; j < 3; j++) {
        children.push(this.createSquare(index))
        index++
      }
      board.push(<div className="board-row" key={row}>
        {children}
      </div>)
      row++
    }
    return board
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    }
    )
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = current.location.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let col, row
    if (i % 3 === 0) {
      col = 1
    } else if (i % 3 === 1) {
      col = 2
    } else {
      col = 3
    }
    if (i < 3) {
      row = 1
    } else if (i < 6) {
      row = 2
    } else {
      row = 3
    }
    location[this.state.stepNumber] = {
      col: col,
      row: row
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var currentlocation = current.location[this.state.stepNumber - 1]
    if (!currentlocation)
      currentlocation = {
        col: '-',
        row: '-'
      }
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start'
      let desc_bold
      if (this.state.stepNumber === move) {
        desc_bold = <b>{desc}</b>
      } else {
        desc_bold = desc
      }
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}>
            {desc_bold}
          </button>
        </li>

      );
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let asc_desc = 
    <button onClick = {() => console.log('das')}>
      togglethisshit
    </button>


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            location={current.location}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <ol>({currentlocation.col}, {currentlocation.row})</ol>
          <ol>{asc_desc}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
