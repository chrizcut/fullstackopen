const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = (props) => <h2>{props.name}</h2>

const Content = ({parts}) => (
  <div>
    {parts.map(
      (part)=>
      <Part part={part} key={part.id}/>
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = ({parts}) => <b>Total of {parts.reduce((total,part)=>total+part.exercises,0)} exercises</b>

export default Course