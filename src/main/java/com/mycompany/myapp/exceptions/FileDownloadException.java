package com.mycompany.myapp.exceptions;

public class FileDownloadException extends SpringBootFileUploadException {

    public FileDownloadException(String message) {
        super(message);
    }
}
