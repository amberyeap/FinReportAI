const API_KEY = 'bbc0e788431742eaaee372866957d361';
const apiUrl = "https://mini-hackathon-43kl.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview";

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadFile");
const fileList = document.getElementById('files');
const resultDiv = document.getElementById('result');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

// Handle file input change
fileInput.addEventListener('change', handleFileInputChange, false);

// Handle upload button click
uploadButton.addEventListener('click', handleUpload, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileInputChange() {
    handleFiles(fileInput.files);
}

function handleFiles(files) {
    if (!files.length) {
        console.error("No files found");
        return;
    }

    fileList.innerHTML = '';
    Array.from(files).forEach(file => {
        const li = document.createElement('li');
        li.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        fileList.appendChild(li);
    });
}

async function handleUpload() {
    const files = fileInput.files.length ? fileInput.files : (fileList.children.length ? new DataTransfer().files : null);
    
    if (!files || files.length === 0) {
        console.error("No files selected");
        return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Image = reader.result;

        const messages = [
            { "role": "system", "content": "You are a helpful assistant that can analyze images." },
            { "role": "user", "content": [
                { "type": "text", "text": "Please analyze this image and describe what you see." },
                { "type": "image_url", "image_url": { "url": base64Image } }
            ]}
        ];

        const payload = {
            "messages": messages,
            "max_tokens": 300
        };

        const headers = {
            'Content-Type': 'application/json',
            'api-key': API_KEY
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
            
            if (resultDiv && responseData.choices && responseData.choices[0]) {
                resultDiv.textContent = response .choices[0].message.content;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };
}