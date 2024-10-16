// const API_KEY = 'bbc0e788431742eaaee372866957d361';
const apiUrl = "http://localhost:5500/parse_data";

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

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_url: base64Image })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
            
            if (resultDiv && responseData.choices && responseData.choices[0]) {
                resultDiv.textContent = responseData.choices[0].message.content;
            } else {
                resultDiv.textContent = "Unexpected response format from the server.";
            }
        } catch (error) {
            console.error("Error:", error);
            if (resultDiv) {
                resultDiv.textContent = "An error occurred while analyzing the image. Please try again.";
            }
        }
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        if (resultDiv) {
            resultDiv.textContent = "Error reading the file. Please try again.";
        }
    };
}