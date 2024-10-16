import requests
import flask
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# API Key
api_key = "bbc0e788431742eaaee372866957d361"

# Function to construct the payload for the summary
def construct_summary_payload(api_key, image_url):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    prompt_messages = [
        {
            "role": "user",
            "content": f"I want to have a summary of all the data from {image_url} in table form"
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

# API endpoint to receive data from the JS frontend
@app.route('/parse_data', methods=['POST', 'GET'])
def parse_data():
    data = request.get_json()
    image_url = data['image_url']
    
    # Step 1: Get the summary from the API
    headers, prompt_messages = construct_summary_payload(api_key, image_url)
    payload = {"messages": prompt_messages}
    response = send_message(payload, headers)
    summary = response["choices"][0]["message"]["content"]
    
    # Step 2: Get the CSV formatted text from the API
    headers, prompt_messages = construct_csv_payload(api_key, summary)
    payload = {"messages": prompt_messages}
    response = send_message(payload, headers)
    csv_content = response["choices"][0]["message"]["content"]
    
    # Step 3: Return the CSV formatted text
    return jsonify({'csv_content': csv_content})

if __name__ == "__main__":
    app.run(debug=True)