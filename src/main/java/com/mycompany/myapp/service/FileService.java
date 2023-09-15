package com.mycompany.myapp.service;

import com.mycompany.myapp.exceptions.FileDownloadException;
import com.mycompany.myapp.exceptions.FileUploadException;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadFile(MultipartFile multipartFile) throws FileUploadException, IOException;

    Object downloadFile(String fileName) throws FileDownloadException, IOException;

    boolean delete(String fileName);
}
