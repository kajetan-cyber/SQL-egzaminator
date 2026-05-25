interface TextAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

export default function TextAnswerInput({ value, onChange, onRun, isRunning }: TextAnswerInputProps) {
  return (
    <section className="panel text-answer" aria-labelledby="text-answer-heading">
      <div className="section-heading">
        <h2 id="text-answer-heading">Odpowiedź</h2>
      </div>
      <input
        aria-label="Odpowiedź tekstowa"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Wpisz instrukcję SQL"
        type="text"
        value={value}
      />
      <div className="editor-actions">
        <button className="primary-button" disabled={isRunning || value.trim().length === 0} onClick={onRun} type="button">
          Sprawdź
        </button>
      </div>
    </section>
  );
}
