 // Determine environment (local or production)
 const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
//  const BASE_URL = isLocal
//      ? "http://127.0.0.1:8000/api/chat"
//      : "https://fast-api-chatbot-backend-2.onrender.com/api";

const BASE_URL="https://fast-api-chatbot-backend-2.onrender.com/api"

export default BASE_URL