
import requests
import json

# This script simulates a Farm OS device sending telemetry data to the centralized cloud function.

# --- Configuration ---
# In a real-world scenario, you would get this from a secure configuration service.
# This URL points to your deployed Firebase Cloud Function.
# NOTE: This is a placeholder and will not work until the function is deployed.
FUNCTION_URL = "https://us-central1-your-project-id.cloudfunctions.net/processFarmOSUpdate"

# The unique ID of the Farm OS node sending the data.
NODE_ID = "FARM-NODE-001"

# --- Data Simulation ---
# This data represents the agricultural metrics collected by the Farm OS sensors over a period.
def get_simulated_telemetry():
    return {
        "x": 5,      # Agricultural base factor (e.g., from soil quality sensors)
        "r": 1.2,    # Growth/Adoption rate (e.g., from farmer input in the OS)
        "n": 4,      # Number of periods (e.g., quarters)
        "dn": 8,     # Direct Nature Factor (e.g., from biodiversity sensors)
        "In": 7,     # Indirect Nature Factor (e.g., from water quality sensors)
        "s": 3       # Crop Cycle Requirement (from crop type selection)
    }

# --- Main Execution ---
def main():
    print(f"--- Starting Farm OS Simulation for Node: {NODE_ID} ---")
    
    telemetry_data = get_simulated_telemetry()
    print(f"Collected Telemetry: {json.dumps(telemetry_data)}")

    # In Firebase, you would use the SDK to call the function.
    # For this simulation, we'll construct an HTTPS request to show the principle.
    payload = {
        "data": {
            "nodeId": NODE_ID,
            "telemetry": telemetry_data
        }
    }
    
    headers = {'Content-Type': 'application/json'}
    
    print(f"\nSending data to cloud function at: {FUNCTION_URL}")
    
    # The following is a commented-out example of the request.
    # To run this, you would need to deploy the function and replace the URL.
    '''
    try:
        response = requests.post(FUNCTION_URL, headers=headers, data=json.dumps(payload))
        response.raise_for_status() # Raise an exception for bad status codes
        
        result = response.json()['result']
        print("\n--- Response from Cloud Function ---")
        print(f"  Status: {result.get('status')}")
        print(f"  Calculated C(a) Value: {result.get('ca_value')}")
        print(f"  Calculated m-constant: {result.get('m_constant')}")
        print("------------------------------------")

    except requests.exceptions.RequestException as e:
        print(f"\nError: Could not connect to the cloud function.")
        print(f"Please ensure the function is deployed and the URL is correct.")
        print(f"Details: {e}")
    '''
    
    print("\n--- Simulation Complete ---")
    print("This script demonstrates the data payload that the Farm OS would send.")
    print("The commented-out code shows how it would call the deployed function.")


if __name__ == "__main__":
    main()

