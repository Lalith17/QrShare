const firebaseApp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  });
const db = firebaseApp.firestore();
const storage =firebaseApp.storage();
document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById('fileInput'); // Define file input element
    const fileListContainer = document.getElementById('fileList'); // Define file list container

    // Listen for changes in the file input element
    fileInput.addEventListener("change", function() {
        // Clear previous file list
        fileListContainer.innerHTML = "";

        // Loop through each selected file and display its name
        for (let i = 0; i < fileInput.files.length; i++) {
            const file = fileInput.files[i];
            const fileName = file.name;
            const listItem = document.createElement("div");
            listItem.textContent = fileName;
            fileListContainer.appendChild(listItem);
        }
    });
    
    // If found you qr code
    function onScanSuccess(decodeText, decodeResult) {
    // Stop taking user input by disabling the input field
    var connectionNumberInput = document.getElementById("connectionNumber");
    connectionNumberInput.disabled = true;

    // Replace the value of the input field with the scanned text
    connectionNumberInput.value = decodeText;

    }
 
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);

    document.getElementById("dataForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
      
        var connectionNumber = document.getElementById("connectionNumber").value;
        var storageRef = storage.ref();

        var filesUploaded = 0; // Counter for files successfully uploaded

        // Loop through each file selected by the user
        for (let i = 0; i < fileInput.files.length; i++) {
            const file = fileInput.files[i];
          
            // Upload the current file to Firebase Storage
            var uploadTask = storageRef.child(`${connectionNumber}/${file.name}`).put(file);

            // Register observers for state change, error, and completion
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Handle state change
                }, 
                (error) => {
                    // Handle error
                    console.error('Error uploading file:', error);
                }, 
                () => {
                    filesUploaded++; // Increment counter for files successfully uploaded
                    
                    // Check if all files have been uploaded successfully
                    if (filesUploaded === fileInput.files.length) {
                        alert('All files uploaded successfully');
                    }
                }
            );
        }
    });
});
