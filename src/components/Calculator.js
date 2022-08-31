import { useReducer, useState } from 'react';
import './calculator.scss';

const ACTION = {
  CALCULATE: 1
}

const buttons = [
  'AC','C', '⌫', /*'%',*/ '÷',
  7, 8, 9, '×',
  4, 5, 6, '−',
  1, 2, 3, '+',
  '00', 0, '.', '='
];

const mathematicalSigns = ['÷', '×', '−', '+'];
const restrictSiblingSigns = [...mathematicalSigns, '%', '.'];


const applyRules = (result, button) => {
  result += button 
  result = result.toString()

  // Clear
  if ( button === 'AC' || button === 'C' ) {
    result = ''
  }

  // Backspace
  if ( button === '⌫' && result ) {
    result = result.slice(0, -2)
  }

  // 00
  if ( ( button === '0' || button === '00' ) && result.length === 2 ) {
    result = '0'
  }

  // Remove leading zero of number
  if ( button !== 0 && Number.isInteger(button) && result[0] == '0' ) {
    result = result.slice(1)
  }

  // Remove first signs
  if ( mathematicalSigns.includes(button) && result.length === 1 ) {
    result = result.slice(0, -1)
  }

  // Parsing
  const slice = result.split('')
  let parse = ''
  let group = []
  for (let i = 0; i < slice.length; i++) {
    const cur = slice[i]
    const prev = i !== 0 ? slice[i-1] : ''

    parse += cur

    if (mathematicalSigns.includes(cur) && mathematicalSigns.includes(prev)) {
      parse = parse.slice(0, -2) + cur
    }

    if ( prev === '.' && mathematicalSigns.includes(cur)) {
      parse = parse.slice(0, -2) + cur
    }

    if ( cur === '.' && prev === '.' ) {
      parse = parse.slice(0, -1)
    }
    
    if ( cur === '=') {
      parse = parse.slice(0, -1)

      if (mathematicalSigns.includes(prev)) {
        parse = parse.slice(0, -1)
      }
    }

  }

  parse = parse.toString()
  // console.log(parse);

  return parse;

}

const replaceToCalc = (str) => {
  str = str.replace(/÷/g, '/')
  str = str.replace(/×/g, '*')
  str = str.replace(/−/g, '-')
  return str
}

const reducer = (state, action) => {

  if (action.type === ACTION.CALCULATE) {

    let rulesApplied = applyRules(state.result, action.button)
    state = {
      historyAll: state.historyAll ? state.historyAll : []
    }
    state.result = rulesApplied

    try {
      let mm = replaceToCalc(state.result)
      state.tempResult = eval(mm).toString()
      state.error = false
    } catch (error) {
      state.error = true
      state.tempResult = state.result
    }
    
    // Create Result
    if (action.button === '=' && state.result) {

      if (!state.error) {
        
        state.history = state.result
        state.result = state.tempResult
        state.tempResult = ''

        // console.log(state.historyAll);

        const store = {
          problem: state.history,
          result: state.result,
        }

        if (store.problem !== store.result && !state.historyAll.some(h => h.problem === store.problem) ) {
          state.historyAll.push(store)
        }

      }
    }
  }

  if (state.tempResult === state.result ) {
    state.tempResult = ''
  }

  return state;
};

function Calculator() {

  const [result, dispatch] = useReducer(reducer, { result: '', history: '', tempResult: ''})

  const buttonClick = (button) => {
    dispatch({ type: ACTION.CALCULATE, button: button })
  }
  
  return (
    <div className="calculator">
      <div className="calculator__results">
        <div className="calculator__history">{ result.history || <>&nbsp;</> }</div>
        <div className="calculator__result">
          { result.tempResult ? <span className="calculator__tempResult">{ result.tempResult }</span> : '' }
          { result.result || <>&nbsp;</> }
        </div>
      </div>
      <div className="calculator__buttons">
        { buttons.map( (button, i) => <button 
          key={`calculator.button.index.${i}`}
          onClick={ () => buttonClick(button) }>{button}</button>) }
      </div>
    </div>
  );
}

export default Calculator;
