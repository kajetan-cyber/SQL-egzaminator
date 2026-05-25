interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

export default function SqlEditor({ value, onChange, onRun, isRunning }: SqlEditorProps) {
  return (
    <section className="panel sql-editor" aria-labelledby="editor-heading">
      <div className="section-heading">
        <h2 id="editor-heading">Edytor SQL</h2>
      </div>
      <textarea
        aria-label="Zapytanie SQL"
        onChange={(event) => onChange(event.target.value)}
        placeholder="SELECT ..."
        spellCheck={false}
        value={value}
      />
      <div className="editor-actions">
        <button className="primary-button" disabled={isRunning || value.trim().length === 0} onClick={onRun} type="button">
          {isRunning ? "Uruchamianie..." : "Uruchom"}
        </button>
      </div>
    </section>
  );
}
