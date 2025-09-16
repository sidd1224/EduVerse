const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5008/eduverse-c818a/us-central1/vlab"
    : "https://us-central1-eduverse-c818a.cloudfunctions.net/vlab");

const HOSTING_BASE =
  process.env.REACT_APP_HOSTING_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5015" // Firebase Hosting emulator
    : "https://eduverse-c818a.web.app"); // your deployed hosting domain

export { API_BASE, HOSTING_BASE };
