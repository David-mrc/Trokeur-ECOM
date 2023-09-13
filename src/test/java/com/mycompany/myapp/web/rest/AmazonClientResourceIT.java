package com.mycompany.myapp.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mycompany.myapp.IntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * Test class for the AmazonClientResource REST controller.
 *
 * @see AmazonClientResource
 */
@IntegrationTest
class AmazonClientResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        AmazonClientResource amazonClientResource = new AmazonClientResource();
        restMockMvc = MockMvcBuilders.standaloneSetup(amazonClientResource).build();
    }

    /**
     * Test defaultAction
     */
    @Test
    void testDefaultAction() throws Exception {
        restMockMvc.perform(get("/api/amazon-client/default-action")).andExpect(status().isOk());
    }
}
