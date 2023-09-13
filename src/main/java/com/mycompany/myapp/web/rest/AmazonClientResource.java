package com.mycompany.myapp.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AmazonClientResource controller
 */
@RestController
@RequestMapping("/api/amazon-client")
public class AmazonClientResource {

    private final Logger log = LoggerFactory.getLogger(AmazonClientResource.class);

    /**
     * GET defaultAction
     */
    @GetMapping("/default-action")
    public String defaultAction() {
        return "defaultAction";
    }
}
