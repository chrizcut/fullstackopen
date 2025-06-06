const PersonForm = (props) => (
  <form onSubmit={props.action}>
    <div>
      name: <input value={props.newName} onChange={props.actionName}/>
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.actionNumber}/>
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
)

export default PersonForm