// en liten färgplockar funktion, här får man upp en färgplatta så man kan välja färger

type ColorPickerProps = {
  onColorChange: (color: string) => void;
};

export function ColorPicker({ onColorChange }: ColorPickerProps) {
  // här hanteras färgändringarna
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
