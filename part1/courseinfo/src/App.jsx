const Header = (props) => {

  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {

  return (
    <div>
      <Part part={props.parts[0].name} exercises={props.parts[0].exercises}/>
      <Part part={props.parts[1].name} exercises={props.parts[1].exercises}/>
      <Part part={props.parts[2].name} exercises={props.parts[2].exercises}/>
    </div>
  )
}

const Part = (props) => {

  return (
    <div>
      <p>
        {props.part} {props.exercises}
      </p>
    </div>
  )
}

const Total = (props) => {

  return (
    <div>
      <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Display = ({counter}) => <div>{counter}</div>

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

import { useState } from 'react'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const [ counter, setCounter ] = useState(0)
  // console.log('rendering with counter value', counter)

  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [total, setTotal] = useState(0)
  const [allClicks, setAll] = useState([])
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => () => {
    console.log("value now",newValue)
    setValue(newValue)
  }

  const increaseByOne = () => {
    // console.log('increasing, value before', counter)
      setCounter(counter + 1)
      // console.log('increasing, value after', counter) //same value as 2 lines above!
  }

  const decreaseByOne = () => setCounter(counter-1)
  
  const setToZero = () => setCounter(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)
    setTotal(left + updatedRight) 
  }

  // debugger

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
      <Button onClick={increaseByOne} text="plus"/>
      <Button onClick={decreaseByOne} text="minus"/>
      <Button onClick={setToZero} text="zero"/>
      <Display counter={counter}/>
      <p>
        {left}
        <button onClick={handleLeftClick}>left</button>
        <button onClick={handleRightClick}>right</button>
        {right}
      </p>
      <History allClicks={allClicks} />
      <p>Total: {total}</p>
      <p>
        Value: {value}
        <button onClick={setToValue(1000)}>1000</button>
        <button onClick={setToValue(1)}>1</button>
      </p>
    </div>
  )
}

export default App