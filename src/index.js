import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import pwds from './pwds.js';
import states from './states.js';
import hang0 from './png/hang0.png'; 
import hang1 from './png/hang1.png'; 
import hang2 from './png/hang2.png'; 
import hang3 from './png/hang3.png'; 
import hang4 from './png/hang4.png'; 
import hang5 from './png/hang5.png'; 
import hang6 from './png/hang6.png'; 
import hang7 from './png/hang7.png'; 
import hang8 from './png/hang8.png'; 
import hangw from './png/hangw.png'; 

class Alphabet extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      kbdRows : 4
    }
    this.ltrClick=this.props.ltrClick.bind(this);
  }

  returnAlphabet()
  {
    const charBtns = [];
    const rows = 4;
    var start = 0;
    var end = 12;
    var i;
    for(i=0; i<rows; i++ ){
      const row = this.props.alphabet.slice(start, end);
      const tblRow = this.formatRow(row);
      charBtns.push([<tr key={i}>{tblRow}</tr>]);

      start = end;
      end +=12;
    }

    return  charBtns;
  }

  formatRow(r)
  {
    const rst = 
      r.map((k) =>
        <Letter key={k +'letter'} i={k} v={k} ltrClick={ this.props.ltrClick} active={this.props.active} />
      );
    return rst;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render()
  {
    console.log(this.state.alphabet);
    return(
      <div>
      <table key='alphabet'><tbody key='alphabetBody'>
      {this.returnAlphabet()} 
      </tbody></table>
      </div>
    )
  }
}

class Letter extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      k: props.k,
      v: props.v,
      active: true
    }
    this.ltrClick=this.props.ltrClick.bind(this);
  }

  render(){
    return (
      <td>
      <button 
      key={this.state.k} 
      onClick={() => this.props.ltrClick(this.state.v) } >
      {this.state.v}
      </button>
      </td>);
  }
}

class Word extends React.Component
{
  render() {
    const w = this.props.progress.map((l,i) => (l !== ' ')?
      <td className="guessWord" key={i + "-" + l}> {l} </td> :
      <td className="guessWordSpace" key={i + "-" + l}> {l} </td> ); 
    return  ([<><h1>Guess the word: </h1><table><tr>{w}</tr></table></>]);
  }
}

class Guesses extends React.Component
{
  render () 
  { 
    const tries = 
      this.props.guesses.map(
        (g) => <td key={g}>{g}</td>
      );
    return(
      [<div><h1>guesses</h1>
        <table>
        {tries}
        </table></div>]
    )
  }
}

class Pic extends React.Component
{
  render() {
    return <img key='hangpic' src={this.props.pic[this.props.picCtr]} alt="gallows" width="20%" height="20%" />;
  }
}

class Board extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      alphabet: ['A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R','S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ],
      guesses: [],
      pic: [hang0, hang1, hang2,
        hang3, hang4, hang5,
        hang6, hang7, hang8, hangw],
      picCtr: 0,
      allWords: this.props.words,
      word2Guess: 'hangemhigh',
      progress: [] 
    }
    this.ltrClick=this.ltrClick.bind(this);
  }

  ltrClick(k){
    this.checkGuess(k);
    const remainingLtrs = this.state.alphabet.filter(ltr => ltr !== k);
    this.setState(function(state, props) {
      return {
        guesses: [...state.guesses, k]
      };
    });
    this.setState(function(state, props) {
      return {
        alphabet: remainingLtrs,
      };
    });
  }

  checkGuess(l){
    if(this.state.picCtr<8){
      const ctr = this.state.word2Guess.length;
      var i = null;
      var found = this.state.progress;
      var ltrMatch = false;
      for(i=0; i<ctr; i++){
        if(this.state.word2Guess[i].toUpperCase() === l.toUpperCase()){
          ltrMatch = true;
          found[i] = l;
        }
      }
      if(ltrMatch){
        this.setState(function(state, props) {
          return {
            progress: found,
          };
        });
      }else{
        this.setState(function(state, props) {
          return {
            picCtr: this.state.picCtr + 1
          };

        });
      }
    } 
    if(this.state.progress.join('').toUpperCase() === this.state.word2Guess.toUpperCase()){
      this.hasWon();
    }
  } 

  hasWon(){
    this.setState(function(state, props) {
      return {
        picCtr: 9 
      };

    });
  }

  componentDidMount() {
    this.PickWord();
  }

  componentWillUnmount() {
  }

  PickWord(){
    var gWord = this.state.allWords[ Math.floor( Math.random() * this.state.allWords.length ) ];
    this.setState(function(state, props){
      return {
        word2Guess : gWord 
      }; 
    }
    );
    var progress = new Array(gWord.length).fill(null,0);
    for(let i =0;i<gWord.length; i++){
      if(gWord[i] === ' '){
        progress[i] = ' ';
      }
    }
    this.setState(function(state, props){
      return {
        progress : progress 
      };
    }
    );
    console.log("gWord: " + gWord);
    console.log("progress: " + this.state.progress.length);
  }

  render()
  {
    return(
      <div>
      <div><Pic pic={this.state.pic} picCtr={this.state.picCtr} /></div>
      <div><Word progress={this.state.progress} /></div>
      <div><Alphabet alphabet={ this.state.alphabet } ltrClick={ this.ltrClick } /></div>
      <div><Guesses guesses={ this.state.guesses } /></div></div>
    )}
}

class Game extends React.Component
{
  render() {
    const instructions =`
  Simple hangman, the words are all names of the US States`;
    return([<><h1>Hangman</h1><h2>{instructions}</h2><div key='hangman'><Board words={states} /></div></>])}
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
