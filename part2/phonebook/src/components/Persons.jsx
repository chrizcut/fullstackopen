const Persons = ({persons,deletePerson}) => {
  return persons.map(person=>
    (<div>
        {person.name}: {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
    </div>))
}

export default Persons