type ColorPickerProps = {
  onColorChange: (color: string) => void;
};

export function ColoprPicker({ onColorChange }: ColorPickerProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  return (
    <>
      <span>Välj färg:</span>
      <input
        type="color"
        onChange={handleColorChange}
        id="colorInput"
        defaultValue="#563d7c"
        title="Choose your color"
      />
    </>
  );
}
