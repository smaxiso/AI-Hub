export const shareTool = async (tool) => {
  const shareData = {
    title: `${tool.name} - AI Tool`,
    text: `Check out ${tool.name}, an amazing AI tool!`,
    url: tool.url
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  } else {
    // Fallback: copy to clipboard
    copyToClipboard(tool.url);
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const getShareUrl = (tool) => {
  return `${window.location.origin}?tool=${tool.id}`;
};

