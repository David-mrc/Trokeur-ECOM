package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.GenericImage;
import com.mycompany.myapp.repository.GenericImageRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GenericImageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GenericImageResourceIT {

    private static final String DEFAULT_IMAGE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_PATH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/generic-images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GenericImageRepository genericImageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGenericImageMockMvc;

    private GenericImage genericImage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GenericImage createEntity(EntityManager em) {
        GenericImage genericImage = new GenericImage().imagePath(DEFAULT_IMAGE_PATH);
        return genericImage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GenericImage createUpdatedEntity(EntityManager em) {
        GenericImage genericImage = new GenericImage().imagePath(UPDATED_IMAGE_PATH);
        return genericImage;
    }

    @BeforeEach
    public void initTest() {
        genericImage = createEntity(em);
    }

    @Test
    @Transactional
    void createGenericImage() throws Exception {
        int databaseSizeBeforeCreate = genericImageRepository.findAll().size();
        // Create the GenericImage
        restGenericImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(genericImage)))
            .andExpect(status().isCreated());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeCreate + 1);
        GenericImage testGenericImage = genericImageList.get(genericImageList.size() - 1);
        assertThat(testGenericImage.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
    }

    @Test
    @Transactional
    void createGenericImageWithExistingId() throws Exception {
        // Create the GenericImage with an existing ID
        genericImage.setId(1L);

        int databaseSizeBeforeCreate = genericImageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGenericImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(genericImage)))
            .andExpect(status().isBadRequest());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkImagePathIsRequired() throws Exception {
        int databaseSizeBeforeTest = genericImageRepository.findAll().size();
        // set the field null
        genericImage.setImagePath(null);

        // Create the GenericImage, which fails.

        restGenericImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(genericImage)))
            .andExpect(status().isBadRequest());

        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGenericImages() throws Exception {
        // Initialize the database
        genericImageRepository.saveAndFlush(genericImage);

        // Get all the genericImageList
        restGenericImageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(genericImage.getId().intValue())))
            .andExpect(jsonPath("$.[*].imagePath").value(hasItem(DEFAULT_IMAGE_PATH)));
    }

    @Test
    @Transactional
    void getGenericImage() throws Exception {
        // Initialize the database
        genericImageRepository.saveAndFlush(genericImage);

        // Get the genericImage
        restGenericImageMockMvc
            .perform(get(ENTITY_API_URL_ID, genericImage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(genericImage.getId().intValue()))
            .andExpect(jsonPath("$.imagePath").value(DEFAULT_IMAGE_PATH));
    }

    @Test
    @Transactional
    void getNonExistingGenericImage() throws Exception {
        // Get the genericImage
        restGenericImageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGenericImage() throws Exception {
        // Initialize the database
        genericImageRepository.saveAndFlush(genericImage);

        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();

        // Update the genericImage
        GenericImage updatedGenericImage = genericImageRepository.findById(genericImage.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGenericImage are not directly saved in db
        em.detach(updatedGenericImage);
        updatedGenericImage.imagePath(UPDATED_IMAGE_PATH);

        restGenericImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGenericImage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGenericImage))
            )
            .andExpect(status().isOk());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
        GenericImage testGenericImage = genericImageList.get(genericImageList.size() - 1);
        assertThat(testGenericImage.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void putNonExistingGenericImage() throws Exception {
        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();
        genericImage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGenericImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, genericImage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(genericImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGenericImage() throws Exception {
        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();
        genericImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenericImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(genericImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGenericImage() throws Exception {
        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();
        genericImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenericImageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(genericImage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGenericImageWithPatch() throws Exception {
        // Initialize the database
        genericImageRepository.saveAndFlush(genericImage);

        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();

        // Update the genericImage using partial update
        GenericImage partialUpdatedGenericImage = new GenericImage();
        partialUpdatedGenericImage.setId(genericImage.getId());

        partialUpdatedGenericImage.imagePath(UPDATED_IMAGE_PATH);

        restGenericImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGenericImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGenericImage))
            )
            .andExpect(status().isOk());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
        GenericImage testGenericImage = genericImageList.get(genericImageList.size() - 1);
        assertThat(testGenericImage.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void fullUpdateGenericImageWithPatch() throws Exception {
        // Initialize the database
        genericImageRepository.saveAndFlush(genericImage);

        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();

        // Update the genericImage using partial update
        GenericImage partialUpdatedGenericImage = new GenericImage();
        partialUpdatedGenericImage.setId(genericImage.getId());

        partialUpdatedGenericImage.imagePath(UPDATED_IMAGE_PATH);

        restGenericImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGenericImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGenericImage))
            )
            .andExpect(status().isOk());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
        GenericImage testGenericImage = genericImageList.get(genericImageList.size() - 1);
        assertThat(testGenericImage.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingGenericImage() throws Exception {
        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();
        genericImage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGenericImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, genericImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(genericImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGenericImage() throws Exception {
        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();
        genericImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenericImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(genericImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGenericImage() throws Exception {
        int databaseSizeBeforeUpdate = genericImageRepository.findAll().size();
        genericImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenericImageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(genericImage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GenericImage in the database
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGenericImage() throws Exception {
        // Initialize the database
        genericImageRepository.saveAndFlush(genericImage);

        int databaseSizeBeforeDelete = genericImageRepository.findAll().size();

        // Delete the genericImage
        restGenericImageMockMvc
            .perform(delete(ENTITY_API_URL_ID, genericImage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GenericImage> genericImageList = genericImageRepository.findAll();
        assertThat(genericImageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
