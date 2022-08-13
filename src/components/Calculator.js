import { useReducer } from 'react';
import './calculator.scss';

const GET_RESULT = 1

const buttons = [
  'C', '%', '<', '/',
  7, 8, 9, '*',
  4, 5, 6, '-',
  1, 2, 3, '+',
  '00', 0, '.', '='
];

const mathematicalSigns = ['/', '*', '-', '+'];
const restrictSiblingSigns = [...mathematicalSigns, '%', '.'];


const resultRules = (result, button) => {
  result += button 
  result = result.toString()

  // Clear
  if ( button === 'C' ) {
    result = ''
  }

  // Parsing
  const slice = result.split('')
  let parse = ''
  for (let i = 0; i < slice.length; i++) {
    const cur = slice[i]
    const prev = i !== 0 ? slice[i-1] : ''

    parse += cur

    if (mathematicalSigns.includes(cur) && mathematicalSigns.includes(prev)) {
      parse = parse.slice(0,-2) + cur
    }

    if ( prev === '.' && mathematicalSigns.includes(cur)) {
      parse = parse.slice(0,-2) + cur
    }

    if ( cur === '.' && prev === '.' ) {
      parse = parse.slice(0,-1)
    }

    if ( cur === '0' && prev === '0'  ) {
      parse = 0
    }
    
    if ( cur === '=') {
      parse = parse.slice(0, -1)

      if (mathematicalSigns.includes(prev)) {
        parse = parse.slice(0, -1)
      }
    }

  }

  parse = parse.toString()
  console.log(parse);

  return parse;

}

const reducer = (state, action) => {
  state = resultRules(state, action.button);
  if (action.type === GET_RESULT) {
    
    // Create Result
    if (action.button === '=') {
      try {
        state = eval(state)
      } catch (error) {
        console.warn('Will fix this bug in next release :)');
        state = ''
      }
    }
  }
  return state;
};

function Calculator() {

  const [result, dispatch] = useReducer(reducer, '');

  const buttonClick = (button) => {
    dispatch({ type: GET_RESULT, button: button })
  }
  
  return (
    <div className="calculator">
      <div className="result">{ result || <>&nbsp;</> }</div>
      <div className="buttons">
        { buttons.map( (button, i) => <button 
          key={`calculator.button.index.${i}`}
          onClick={ () => buttonClick(button) }>{button}</button>) }
      </div>
    </div>
  );
}

export default Calculator;
