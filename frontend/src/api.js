// api.js (utility file)
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5008/eduverse-c818a/us-central1/vlab" // emulator
    : "https://us-central1-eduverse-c818a.cloudfunctions.net/vlab"; // deployed

export default API_BASE;
