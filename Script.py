import requests

# API Key
api_key = "bbc0e788431742eaaee372866957d361"

# Image URL
image_url = "https://i.imgur.com/NQLtRtT.jpeg"

# Function to construct the payload for the summary
def construct_summary_payload(api_key, image_url):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    prompt_messages = [
        {
            "role": "user",
            "content": f"I want to extract out all the field names that are found in the picture at {image_url} and list them out."
        }
    ]
    return headers, prompt_messages

# Function to send the message to the API
def send_message(payload, headers):
    try:
        response = requests.post("https://mini-hackathon-43kl.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview", headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")

# Function to construct the payload for the CSV conversion
def construct_csv_payload(api_key, summary):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    prompt_messages = [
        {
            "role": "user",
            "content": f"Convert the following text into a CSV formatted text: {summary}"
        }
    ]
    return headers, prompt_messages

# Main function
def main():
    headers, prompt_messages = construct_summary_payload(api_key, image_url)
    payload = {"messages": prompt_messages}
    
    # Step 1: Get the summary from the API
    response = send_message(payload, headers)
    summary = response["choices"][0]["message"]["content"]
    
    # Step 2: Get the CSV formatted text from the API
    headers, prompt_messages = construct_csv_payload(api_key, summary)
    payload = {"messages": prompt_messages}
    response = send_message(payload, headers)
    csv_content = response["choices"][0]["message"]["content"]
    
    # Step 3: Save the CSV formatted text to a file
    with open("output.csv", "w", newline="") as csvfile:
        csvfile.write(csv_content)

if __name__ == "__main__":
    main()