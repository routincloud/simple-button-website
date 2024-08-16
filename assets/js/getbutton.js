/* Routin Cloud Free Button Sample
 * Alpha V0.2
 * This script dynamically fetches user data based on a specific UUID from a JSON file.
 * It constructs the URL for the JSON file using the UUID and retrieves the data.
 * If user data is found for the given UUID, it assigns this data to the global `window.userData` object.
 * It then creates a script element to load `code.js` and appends it to the document head for further processing.
 * If the UUID is not found or an error occurs during the fetch operation, appropriate messages are logged to the console.
 * Made for Routin.cloud by @hiddensetup
 */

(async () => {
    const scriptElement = document.currentScript;
    const baseUrl = new URL(scriptElement.src).origin;
  
    const uuid = "44fcd6b84507abe1bbef6daa8bdc0803";
    try {
      const response = await fetch(`/assets/data/44fcd6b84507abe1bbef6daa8bdc0803.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const userData = data.users?.[uuid];
      if (userData) {
        window.userData = userData;
        const script = document.createElement("script");
        script.src = `/assets/js/code.js`;
        document.head.appendChild(script);
      } else {
        console.warn("No user data found for the given UUID. Exiting script.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  })();
  