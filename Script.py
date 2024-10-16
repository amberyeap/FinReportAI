import requests

# API Key
api_key = "bbc0e788431742eaaee372866957d361"

# Image URL
image_url = "https://storagekhen.blob.core.windows.net/file/abc.jpg?sp=r&st=2024-10-15T05:16:08Z&se=2024-10-23T13:16:08Z&spr=https&sv=2022-11-02&sr=b&sig=4GTAFcWl%2BMnZ64aAqVCBg%2FZ%2BgYmg2nLPgE0VvEXifCw%3D"

# Function to construct the payload for the summary
def construct_summary_payload(image_url):
    prompt_messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarise the data in the following image and arrange it.\n"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://storagekhen.blob.core.windows.net/file/abc.jpg?sp=r&st=2024-10-15T05:16:08Z&se=2024-10-23T13:16:08Z&spr=https&sv=2022-11-02&sr=b&sig=4GTAFcWl%2BMnZ64aAqVCBg%2FZ%2BgYmg2nLPgE0VvEXifCw%3D"
                    }
                },
    		]
		}
	]
    return prompt_messages

# Function to send the message to the API
def send_message(payload, api_key):
    url = f"https://mini-hackathon-43kl.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview&api-key={api_key}"
    try:
        response = requests.post(url, json=payload)  # Send the payload in the request body
        response.raise_for_status()  # This will raise an error for HTTP error responses
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        return None  # Return None if there's an error
    except Exception as err:
        print(f"An error occurred: {err}")
        return None  # Return None if there's an error

# Function to construct the payload for the CSV conversion
def construct_csv_payload(summary):
    prompt_messages = [
        {
            "role": "user",
            "content": f"Convert the following text into a CSV formatted text: {summary}"
        }
    ]
    return prompt_messages

def main():
    # Step 1: Get the summary from the API
    prompt_messages = construct_summary_payload(image_url)
    payload = {"messages": prompt_messages}
    
    response = send_message(payload, api_key)
    if response is None:
        print("Failed to get a valid response from the API.")
        return  # Exit or handle the error appropriately
    summary = response["choices"][0]["message"]["content"]
    
    # Step 2: Get the CSV formatted text from the API
    prompt_messages = construct_csv_payload(summary)
    payload = {"messages": prompt_messages}
    response = send_message(payload, api_key)
    if response is None:
        print("Failed to get a valid response from the API.")
        return  # Exit or handle the error appropriately
    csv_content = response["choices"][0]["message"]["content"]
    
    # Step 3: Save the CSV formatted text to a file
    with open("output.csv", "w", newline="") as csvfile:
        csvfile.write(csv_content)
        

if __name__ == "__main__":
    main()