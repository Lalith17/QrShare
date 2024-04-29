const firebaseApp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  });
const generatedCodes = new Set(); // Set to store generated codes

function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;

    do {
        code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
    } while (generatedCodes.has(code)); // Repeat until a unique code is generated

    generatedCodes.add(code); // Add the code to the set of generated codes
    return code;
}

document.addEventListener("DOMContentLoaded", function() {
    const connectionCodeElement = document.getElementById("connectionCode");
    const fetchButton = document.getElementById("fetchButton");
    let qrcode = new QRCode( 
        document.querySelector(".qrcode") 
    );
    // Generate the connection code and display it
    const connectionCode = generateRandomCode();
    connectionCodeElement.textContent = connectionCode;
    qrcode.makeCode(connectionCode); 
    // generateQRCode(connectionCode,qrCodeContainer);

    // Add event listener to fetch button
    fetchButton.addEventListener("click", function() {
        fetchFiles(connectionCode); // Fetch files using the connection code
    });
});
// Function to fetch files from Firebase

function fetchFiles(code) {
  var fileListContainer = document.getElementById("fileList");

  // Reference to the storage bucket
  var storageRef = firebase.storage().ref().child(code);
  
  // Get the list of files in the storage bucket
  storageRef.listAll().then(function(res) {
      fileListContainer.innerHTML = ""; // Clear previous file list

      res.items.forEach(function(itemRef) {
          // Create a list item for each file
          const listItem = document.createElement("li");
          const link = document.createElement("a");

          // Get the download URL for the file
          itemRef.getDownloadURL().then(function(url) {
              // Set the href attribute of the link to the file URL
              link.href = url;
              link.innerText = itemRef.name; // Display the file name as the link text

              // Programmatically trigger download when link is clicked
              link.addEventListener("click", function(event) {
                  event.preventDefault(); // Prevent default link behavior
                  downloadFile(url, itemRef.name); // Download the file
              });
          });

          listItem.appendChild(link);
          fileListContainer.appendChild(listItem);
      });
  }).catch(function(error) {
      console.error('Error fetching files:', error);
      fileListContainer.innerHTML = "<li>Error fetching files. Please try again.</li>";
  });
}

// Function to download file programmatically
function downloadFile(url, fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";

  xhr.onload = function() {
      if (xhr.status === 200) {
          var blob = xhr.response;
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
      }
  };

  xhr.send();
}

function generateQRCode(connectionCode,qrCodeContainer) {
    // Create QR code instance with the connection code as data
    var qrCode = new QRCode(qrCodeContainer, {
        text: connectionCode,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H // High error correction level
    });

}