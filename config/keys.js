// API Key validation and management

export function validateApiKey(keyName = "OPENAI_API_KEY") {
  const apiKey = process.env[keyName];
  
  if (!apiKey) {
    console.error(`❌ ERROR: ${keyName} (Google API Key) not found in .env file!`);
    process.exit(1);
  }
  
  return apiKey;
}

export function getApiKey(keyName = "OPENAI_API_KEY") {
  return process.env[keyName];
}

