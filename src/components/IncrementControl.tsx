import React from 'react';

interface IncrementControlProps {
  value: number;
  onChange: (newVal: number) => void;
}

const IncrementControl: React.FC<IncrementControlProps> = ({ value, onChange }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v > 0) {
      onChange(v);
    }
  };

  return (
    <div className="increment-control">
      <label>
        Increment:
        <input
          type="number"
          min="1"
          value={value}
          onChange={handleInput}
        />
      </label>
    </div>
  );
};

export default IncrementControl;
