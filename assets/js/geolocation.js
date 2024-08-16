/*
 * Alpha V0.5
 * This script is designed to fetch the user's IP address and subsequently use it to determine the user's geographical location.
 * It retrieves the IP address using the ipify API and then fetches location details (city, region, country, and coordinates) using the ipapi service.
 * This data is logged to the console for further use in other parts of the application.
 * The script automatically fetches the location when it is loaded, providing an easy way to gather geolocation data.
 * Made for Routin.cloud by @hiddensetup
 */

const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
};

const getGeoLocation = async (ip) => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    console.log('Location Information:', data);
    return {
      city: data.city,
      region: data.region,
      country: data.country_name,
      loc: `${data.latitude},${data.longitude}`,
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};

const fetchLocation = async () => {
  const ip = await getIpAddress();
  if (ip) {
    await getGeoLocation(ip);
  }
};

fetchLocation();
