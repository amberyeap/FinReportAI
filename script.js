const dropArea = getElementbyId('dropArea')

// Prevent default behavior (Prevent file from being opened)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over'), false);
});

dropArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

// Function to handle files and display them
function handleFiles(files) {
    const fileList = document.getElementById('files');
    fileList.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${files[i].name} (${(files[i].size / 1024).toFixed(2)} KB)`;
        fileList.appendChild(li);
    }
}

// Function to submit/post files to endpoint

const uploadFile = getElementById("uploadFile")

