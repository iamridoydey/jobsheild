export interface UploadArgs {
  file: Promise<FileUpload>;
}

export interface DeleteArgs {
  publicId: string;
}
