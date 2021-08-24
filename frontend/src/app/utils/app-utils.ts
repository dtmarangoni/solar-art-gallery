/**
 * Read a file and return its coded URL in base64 format.
 * @param file The file to be read.
 * @returns A promise that will resolves to coded URL base64 format
 * from file or rejected in case of error.
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create the file reader
    const fileReader = new FileReader();
    // Function that`s fired when the reading ends
    fileReader.onload = () => resolve(fileReader.result as string);
    // On error
    fileReader.onerror = () => reject('Error while reading the file.');
    // Read the file as base64 format
    fileReader.readAsDataURL(file);
  });
}

/**
 * Creates a form for file uploads.
 * @param fileName The file name.
 * @param file The file to be uploaded.
 * @returns The upload file form.
 */
export function uploadFileForm(fileName: string, file: File) {
  const formData = new FormData();
  formData.append(fileName, file, fileName);
  return formData;
}
