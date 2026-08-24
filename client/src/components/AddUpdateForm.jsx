function AddUpdateForm({
  message,
  setMessage,
  handleAddUpdate,
}) {
  return (
    <form onSubmit={handleAddUpdate}>
      <h3>Add Update</h3>

      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        placeholder="Enter update"
        required
      />

      <button type="submit">
        Add Update
      </button>
    </form>
  )
}

export default AddUpdateForm