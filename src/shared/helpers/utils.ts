export const isEmptyValue = (val: any): boolean => {
    if(val == undefined || val == '' || val == null) return true;
    else return false;
};

export const isEmptyObject = (obj: Object): boolean => {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) return false;
    else return true;
};

export const encodeBase64 = (val: string): string => {
    return btoa(val);
};

export const decodeBase64 = (val: string): string => {
    return atob(val);
};

export const getValuesID = (val: string): Array<string> => {
    return val.split(':');
};

export const getPathUrl = (url: string): string => {
    return url.substr(1).trim();
};

export const downloadFileFromUrl = (url: string): void => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substr(url.lastIndexOf('/') + 1);
    link.click();
};

export const downloadBase64 = (data: string, name: string, type: string): void => {
  const linkSource = `data:${type};base64,${data}`;
  const downloadLink = document.createElement('a');
  const fileName = `${name}.${type}`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};