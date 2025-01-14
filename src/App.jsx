import {useState, useEffect} from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'




const App = ( ) => {
  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState('')
  const [showAll,setShowAll] = useState(false)
  const [errorMessage,setErrorMessage] = useState('some error happened...')

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n=> n.id === id)
    const changedNote = {...note, important: !note.important}
    noteService.update(id,changedNote).then(returnedNote =>{
      setNotes(notes.map(note => note.id === id ? returnedNote: note))

    }).catch(error=>{
      setErrorMessage(`Note ${note.content} was already removed from server`)
      setTimeout(()=>{
        setErrorMessage(null)
      },5000)
      setNotes(notes.filter(n=> n.id != id))

    })
    console.log(`importance of ${id} needs to be toggled`)

  }



  useEffect(() =>{
    
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  },[])




  const Footer = () => {
    const footerStlye = {
        color: 'green',
        fontStlye: 'italic',
        fontSize: 16
      }
      return (
        <div style={footerStlye}>
          <br />
          <em> Note app, Department of Computer Science, University of Helsinki 2024</em>
        </div>
      )
    }
    
  

  const Notification = ({message}) =>{
    if (message === null){
      return null
    }
    return (
      <div className="error">{message}</div>
    )

  }
  
  console.log('render',notes.length,'notes')

  const addnote = (event) =>{
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important:Math.random()<0.5,
      id:String(notes.length + 1),
    }

   noteService.create(noteObject).then(returnedNote => {
    setNotes(notes.concat(returnedNote))
    setNewNote('')
   })

  }

  const handleNoteChange = (event) =>{
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes: notes.filter(note => note.important)
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}></Notification>
      <button onClick={()=>setShowAll(!showAll)}>
        show {showAll ? 'important': 'all'}
      </button>

      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />

        )}
      </ul>
    
    <form onSubmit={addnote}>
      <input value = {newNote} onChange={handleNoteChange}/>
      <button type='submit'>save</button>
      
    </form>
    <Footer/>
    </div>
  )
}

export default App