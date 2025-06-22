import React from 'react';

function CopyButton({ textToCopy }) {
  const handleCopy = async () => {
    try {
        console.log(textToCopy)
      await navigator.clipboard.writeText(textToCopy.map(card => `${card[0]} ${card[1]}`).join('\n'));
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button onClick={handleCopy}>
      Copy
    </button>
  );
}

export default CopyButton;
