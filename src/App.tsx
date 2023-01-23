import { useState } from 'react';

function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="App">
      <form>
        <label htmlFor="resume">Resume</label>
        <input
          type="file"
          name="resume"
          id="resume"
          onChange={(e) => setFile(e.target.files && e.target.files[0])}
        ></input>
        <button disabled={file == null}>Submit</button>
      </form>
    </div>
  );
}

export default App;
