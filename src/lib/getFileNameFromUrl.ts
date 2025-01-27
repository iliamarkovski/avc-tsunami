export const getFileNameFromUrl = (url: string | undefined) => {
  if (!url) return url;
  // Use a regular expression to extract the part after "/statistics"
  const match = url.match(/\/statistics%2F([^?]+)/);
  if (match && match[1]) {
    // Decode the URL-encoded part to get the original file name
    return decodeURIComponent(match[1]);
  }
  return null; // Return null if no match is found
};
