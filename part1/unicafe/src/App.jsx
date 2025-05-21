import { useState } from 'react'

const Button = (props) => <button onClick={()=>props.setValue(props.value+1)}>{props.text}</button>

const StaticLine = (props) => {
  if (props.text=="positive") return  <tr><td>{props.text}</td><td> {props.value} %</td></tr>

  return <tr><td>{props.text}</td><td>{props.value}</td></tr>
}

const Statistics = (props) =>{

  const all=props.good+props.neutral+props.bad

  if (all==0) return <div>No feedback given</div>
  
  return <div>
      <table>
        <StaticLine text="good" value={props.good}/>
        <StaticLine text="neutral" value={props.neutral}/>
        <StaticLine text="bad" value={props.bad}/>
        <StaticLine text="all" value={all}/>
        <StaticLine text="average" value={(props.good-props.bad)/all}/>
        <StaticLine text="positive" value={props.good/all*100}/>
      </table>
  </div>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" setValue={setGood} value={good}/>
      <Button text="neutral" setValue={setNeutral} value={neutral}/>
      <Button text="bad" setValue={setBad} value={bad}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App