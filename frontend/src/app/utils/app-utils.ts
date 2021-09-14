import { HttpParams } from '@angular/common/http';

import { PaginationQueryParams } from '../../models/API/Common';

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
 * Create the pagination query params for HTTP request if necessary.
 * @param queryParams The pagination query params.
 * @returns The HTTP request pagination query params.
 */
export function paginationQueryParams(queryParams?: PaginationQueryParams) {
  if (queryParams) {
    let params = new HttpParams();

    if (queryParams?.limit) {
      params = params.set('limit', queryParams.limit.toString());
    }
    if (queryParams?.nextKey) {
      params = params.set('nextKey', queryParams.nextKey);
    }

    return params;
  }

  // If not provided, return undefined for HTTP query params.
  return undefined;
}

/**
 * From an array of objects, split the desired properties from each
 * element.
 * @param objArray The array of objects.
 * @param properties The properties to be separated from each array
 * object.
 * @returns The array of objects with desired properties separated.
 */
export function splitArrObjsProps(objArray: any[], ...properties: string[]) {
  // Initialize the split array of objects variable
  const splitArrObjs: { remainingProps: any[]; [key: string]: any[] } = {
    remainingProps: [],
  };

  objArray.forEach((obj) => {
    splitArrObjs.remainingProps.push(
      Object.keys(obj).reduce((accumulator, objKey) => {
        if (!properties.includes(objKey)) {
          // All other properties
          accumulator[objKey] = obj[objKey];
        } else {
          // The property to be separated
          if (!splitArrObjs[objKey]) splitArrObjs[objKey] = [];
          splitArrObjs[objKey].push(obj[objKey]);
        }
        return accumulator;
      }, {} as any)
    );
  });

  return splitArrObjs;
}
