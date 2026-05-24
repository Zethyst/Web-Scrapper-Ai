require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function testBackend() {
  console.log("🔍 Testing Backend Connection\n");
  console.log(`API URL: ${API_BASE_URL}/tasks\n`);

  try {
    console.log("1️⃣ Testing connection...");
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Error Response:`, errorText.substring(0, 500));
      return;
    }

    const data = await response.json();
    console.log(`   ✅ Success! Received ${data.length} tasks`);
    if (data.length > 0) {
      console.log(`   Sample task:`, JSON.stringify(data[0], null, 2));
    }
  } catch (error) {
    console.error("   ❌ Connection failed!");
    console.error(`   Error type: ${error.constructor.name}`);
    console.error(`   Error message: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.error("\n💡 TIP: Backend server is not running!");
      console.error("   Start it with: cd backend && npm run dev");
    } else if (error.message.includes('fetch')) {
      console.error("\n💡 TIP: Check if:");
      console.error("   1. Backend server is running on port 5000");
      console.error("   2. NEXT_PUBLIC_API_URL is set correctly");
      console.error("   3. CORS is configured properly");
    }
  }
}

testBackend();
