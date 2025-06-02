const Filter = (props) => (
  <div>
    Filter names: <input value={props.value} onChange={props.action}/>
  </div>
)

export default Filter