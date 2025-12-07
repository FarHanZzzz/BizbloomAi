import httpx
import asyncio

base_url = "http://127.0.0.1:8000/api"

async def test_endpoints():
    async with httpx.AsyncClient() as client:
        print("Testing Register...")
        email = "test_user_new_1@bizbloom.ai"
        password = "password123"
        
        try:
            resp = await client.post(f"{base_url}/auth/register", json={
                "email": email,
                "password": password,
                "interests": ["coding"]
            })
            print(f"Register Status: {resp.status_code}")
            print(f"Register Response: {resp.text}")
        except Exception as e:
            print(f"Register Failed: {e}")
            return

        print("\nTesting Login...")
        try:
            resp = await client.post(f"{base_url}/auth/login", json={
                "email": email,
                "password": password
            })
            print(f"Login Status: {resp.status_code}")
            print(f"Login Response: {resp.text}")
        except Exception as e:
            print(f"Login Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
