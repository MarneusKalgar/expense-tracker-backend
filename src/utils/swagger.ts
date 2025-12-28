export const getVersionFromFilename = (file: string): string => {
  const versionMatch = /openapi\.(\d+\.\d+)\.yaml/.exec(file);
  const version = versionMatch ? versionMatch[1] : "unknown";
  return version!;
};

export const getFileNameFromUrl = (url: string): string => {
  const parts = url.split("/");
  return parts[parts.length - 1]!;
};
