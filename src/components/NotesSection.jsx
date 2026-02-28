import { useState, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

function NotesSection() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('learning-notes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [inputText, setInputText] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editCategory, setEditCategory] = useState('')

  // Savenotes local storage 
  useEffect(() => {
     console.log('notes:', notes)
    localStorage.setItem('learning-notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!inputText.trim()) return
    setNotes([...notes, { id: Date.now(), text: inputText.trim(), category: categoryInput.trim(), createdAt: new Date().toISOString() }])
    setInputText('')
    setCategoryInput('')
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id))
  }

  const startEdit = (note) => {
    setEditId(note.id)
    setEditText(note.text)
    setEditCategory(note.category || '')
  }

  const saveEdit = () => {
    if (!editText.trim()) return
    setNotes(notes.map((n) =>
      n.id === editId ? { ...n, text: editText.trim(), category: editCategory.trim(), updatedAt: new Date().toISOString() } : n
    ))
    setEditId(null)
    setEditText('')
    setEditCategory('')
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
    setEditCategory('')
  }

  return (
    <section className="notes-section">
      <div className="notes-head">
        <h2>My Learning Notes {notes.length > 0 && <span className="notes-count">{notes.length}</span>}</h2>
        <p>Write down key points from courses you have watched~</p>
      </div>

      <div className="notes-input-row">
        <input
          className="notes-category-input"
          type="text"
          placeholder="Course (optional)"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
        />
        <TextareaAutosize
          className="notes-input"
          placeholder="Tulis catatan baru disini"
          value={inputText}
          minRows={1}
          maxRows={6}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote()
          }}
        />
        <button className="notes-add-btn" onClick={addNote}>Add Note</button>
      </div>

      {notes.length === 0 ? (
        <div className="notes-empty">
          <p>No notes yet.</p>
          <span>Start adding key points from courses you've watched!</span>
        </div>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id} className="notes-item">
              {editId === note.id ? (
                <>
                  <input
                    className="notes-category-input"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Course (optional)"
                  />
                  <TextareaAutosize
                    className="notes-edit-input"
                    value={editText}
                    minRows={1}
                    maxRows={6}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                  <div className="notes-actions">
                    <button className="notes-btn notes-save" onClick={saveEdit}>Save</button>
                    <button className="notes-btn notes-cancel" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="notes-item-body">
                    {note.category && <span className="notes-category-badge">{note.category}</span>}
                    <span className="notes-text">{note.text}</span>
                    <span className="notes-time">
                      {note.updatedAt
                        ? <>Edited &middot; {formatDate(note.updatedAt)}</>
                        : formatDate(note.createdAt)}
                    </span>
                  </div>
                  <div className="notes-actions">
                    <button className="notes-btn notes-edit" onClick={() => startEdit(note)}>Edit</button>
                    <button className="notes-btn notes-delete" onClick={() => deleteNote(note.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default NotesSection
