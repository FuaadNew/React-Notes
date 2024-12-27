const Note = ({ note, toggleImportance }) => {
  const Label = note.important ? 'make not important': 'make important'
  return (
    <li>{note.content}
    <button onClick ={toggleImportance}> {Label} </button>
    </li>
  )
}



export default Note