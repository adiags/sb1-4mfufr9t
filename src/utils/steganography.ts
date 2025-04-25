/**
 * NOTE: This is a simplified implementation of steganography for demonstration purposes.
 * In a real application, you would likely use a more robust library or server-side implementation.
 */

/**
 * Encodes a message within an image using a basic LSB (Least Significant Bit) steganography technique
 * @param image The image file to encode the message into
 * @param message The message to encode
 * @param password Optional password for additional security
 * @param quality Image quality (0.1 to 1.0)
 * @returns A promise that resolves to a data URL of the encoded image
 */
export const encode = async (
  image: File,
  message: string,
  password?: string,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element to work with the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Unable to create canvas context');
      }
      
      // Load the image
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Encrypt message if password is provided
        const messageToEncode = password 
          ? simpleCrypt(message, password)
          : message;
        
        // Convert message to binary
        const binaryMessage = stringToBinary(messageToEncode);
        
        // Check if message is too large for the image
        if (binaryMessage.length > (data.length / 4) * 3) {
          reject(new Error('Message is too large for this image'));
          return;
        }
        
        // Add message length as header (32 bits = 4 bytes for length)
        const binaryLength = messageToEncode.length.toString(2).padStart(32, '0');
        const binaryData = binaryLength + binaryMessage;
        
        // Embed data in the least significant bits of the image
        let dataIndex = 0;
        for (let i = 0; i < binaryData.length; i++) {
          // Skip alpha channel (every 4th byte)
          if (dataIndex % 4 === 3) {
            dataIndex++;
          }
          
          // Modify least significant bit
          if (binaryData[i] === '1') {
            data[dataIndex] = data[dataIndex] | 1; // Set LSB to 1
          } else {
            data[dataIndex] = data[dataIndex] & ~1; // Set LSB to 0
          }
          
          dataIndex++;
        }
        
        // Put the modified pixel data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png', quality);
        resolve(dataURL);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load the image'));
      };
      
      // Set the source of the image to the uploaded file
      img.src = URL.createObjectURL(image);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Decodes a message from an image that was encoded using the encode function
 * @param image The image file containing the encoded message
 * @param password Optional password if the message was encrypted
 * @returns A promise that resolves to the decoded message or null if no message was found
 */
export const decode = async (
  image: File,
  password?: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element to work with the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Unable to create canvas context');
      }
      
      // Load the image
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Extract binary data from the least significant bits
        let binaryData = '';
        let dataIndex = 0;
        
        // First, extract the 32-bit length header
        while (binaryData.length < 32) {
          // Skip alpha channel
          if (dataIndex % 4 === 3) {
            dataIndex++;
          }
          
          // Get LSB
          binaryData += (data[dataIndex] & 1).toString();
          dataIndex++;
        }
        
        // Parse the length
        const messageLength = parseInt(binaryData, 2);
        
        // Reset binary data for the actual message
        binaryData = '';
        
        // Extract the message binary data
        const binaryMessageLength = messageLength * 8; // 8 bits per character
        while (binaryData.length < binaryMessageLength) {
          // Skip alpha channel
          if (dataIndex % 4 === 3) {
            dataIndex++;
          }
          
          // Get LSB
          binaryData += (data[dataIndex] & 1).toString();
          dataIndex++;
          
          // Break if we've reached the end of the pixel data
          if (dataIndex >= data.length) break;
        }
        
        // Convert binary back to string
        let message = binaryToString(binaryData);
        
        // Decrypt if password was provided
        if (password) {
          try {
            message = simpleCrypt(message, password);
          } catch (error) {
            // If decryption fails, it might be the wrong password
            resolve(null);
            return;
          }
        }
        
        resolve(message);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load the image'));
      };
      
      // Set the source of the image to the uploaded file
      img.src = URL.createObjectURL(image);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Converts a string to its binary representation
 * @param str The string to convert
 * @returns Binary string
 */
function stringToBinary(str: string): string {
  let binary = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const binaryChar = charCode.toString(2).padStart(8, '0');
    binary += binaryChar;
  }
  return binary;
}

/**
 * Converts a binary string back to a regular string
 * @param binary The binary string to convert
 * @returns Regular string
 */
function binaryToString(binary: string): string {
  let string = '';
  // Process 8 bits at a time
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      const charCode = parseInt(byte, 2);
      string += String.fromCharCode(charCode);
    }
  }
  return string;
}

/**
 * Simple XOR-based encryption/decryption
 * NOTE: This is not secure for real-world use
 * @param text Text to encrypt or decrypt
 * @param key Encryption key
 * @returns Encrypted or decrypted text
 */
function simpleCrypt(text: string, key: string): string {
  let result = '';
  
  // Create a repeating key pattern
  const repeatedKey = key.repeat(Math.ceil(text.length / key.length)).slice(0, text.length);
  
  // XOR each character with corresponding key character
  for (let i = 0; i < text.length; i++) {
    const textCharCode = text.charCodeAt(i);
    const keyCharCode = repeatedKey.charCodeAt(i);
    
    // XOR operation
    const encryptedCharCode = textCharCode ^ keyCharCode;
    
    result += String.fromCharCode(encryptedCharCode);
  }
  
  return result;
}