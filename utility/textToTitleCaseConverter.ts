export const toTitleCase = (text:string) => {
    return text
      .trim()
      .split(/\s+/) // Split by spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
      .join(" "); // Join with spaces
  };
  
  