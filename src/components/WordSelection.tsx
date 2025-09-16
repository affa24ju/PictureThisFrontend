import { Button, Flex, Text, Card } from "@radix-ui/themes";

interface WordSelectionProps {
  wordOptions: string[];
  onWordSelect: (word: string) => void;
}

export function WordSelection({ wordOptions, onWordSelect }: WordSelectionProps) {
  return (
    <>
     {/* bakgrund */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* välj ord knappar */}
        <Card size="4" style={{ minWidth: '400px', maxWidth: '500px' }}>
          <Flex direction="column" gap="4" align="center">
            <Text size="6" weight="bold" align="center">
              Välj ett ord att rita:
            </Text>
            
            <Flex gap="3" justify="center" wrap="wrap">
              {wordOptions.map((word, index) => (
                <Button
                  key={index}
                  onClick={() => onWordSelect(word)}
                  size="3"
                  variant="solid"
                  color="green"
                  style={{ minWidth: "120px" }}
                >
                  {word}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Card>
      </div>
    </>
  );
}