/**
 * @param {string} containerId - ID from the HTML element where the QR code image will be inserted.
 * @param {string} urlToEncode - Url that you want to encode into the QR code.
 */
export function generateQRCode(containerId, urlToEncode) {
    const imgElement = document.getElementById(containerId);
    if (!imgElement) return;

    // Encode the URL to ensure it's properly formatted for the API request
    const encodedData = encodeURIComponent(urlToEncode);
    
    // Endpoint 
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}&color=2C4A3E`;

    // Set the image source to the API URL, which will return the generated QR code
    imgElement.src = apiUrl;
    imgElement.alt = "QR Code to share this invitation";
}