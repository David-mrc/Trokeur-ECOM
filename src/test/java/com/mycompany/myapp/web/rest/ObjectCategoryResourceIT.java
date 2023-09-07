package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ObjectCategory;
import com.mycompany.myapp.repository.ObjectCategoryRepository;
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
 * Integration tests for the {@link ObjectCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ObjectCategoryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/object-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectCategoryRepository objectCategoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restObjectCategoryMockMvc;

    private ObjectCategory objectCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ObjectCategory createEntity(EntityManager em) {
        ObjectCategory objectCategory = new ObjectCategory().name(DEFAULT_NAME);
        return objectCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ObjectCategory createUpdatedEntity(EntityManager em) {
        ObjectCategory objectCategory = new ObjectCategory().name(UPDATED_NAME);
        return objectCategory;
    }

    @BeforeEach
    public void initTest() {
        objectCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createObjectCategory() throws Exception {
        int databaseSizeBeforeCreate = objectCategoryRepository.findAll().size();
        // Create the ObjectCategory
        restObjectCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isCreated());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        ObjectCategory testObjectCategory = objectCategoryList.get(objectCategoryList.size() - 1);
        assertThat(testObjectCategory.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createObjectCategoryWithExistingId() throws Exception {
        // Create the ObjectCategory with an existing ID
        objectCategory.setId(1L);

        int databaseSizeBeforeCreate = objectCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restObjectCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = objectCategoryRepository.findAll().size();
        // set the field null
        objectCategory.setName(null);

        // Create the ObjectCategory, which fails.

        restObjectCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isBadRequest());

        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllObjectCategories() throws Exception {
        // Initialize the database
        objectCategoryRepository.saveAndFlush(objectCategory);

        // Get all the objectCategoryList
        restObjectCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(objectCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getObjectCategory() throws Exception {
        // Initialize the database
        objectCategoryRepository.saveAndFlush(objectCategory);

        // Get the objectCategory
        restObjectCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, objectCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(objectCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingObjectCategory() throws Exception {
        // Get the objectCategory
        restObjectCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingObjectCategory() throws Exception {
        // Initialize the database
        objectCategoryRepository.saveAndFlush(objectCategory);

        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();

        // Update the objectCategory
        ObjectCategory updatedObjectCategory = objectCategoryRepository.findById(objectCategory.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedObjectCategory are not directly saved in db
        em.detach(updatedObjectCategory);
        updatedObjectCategory.name(UPDATED_NAME);

        restObjectCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedObjectCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedObjectCategory))
            )
            .andExpect(status().isOk());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
        ObjectCategory testObjectCategory = objectCategoryList.get(objectCategoryList.size() - 1);
        assertThat(testObjectCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingObjectCategory() throws Exception {
        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();
        objectCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restObjectCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, objectCategory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchObjectCategory() throws Exception {
        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();
        objectCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restObjectCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamObjectCategory() throws Exception {
        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();
        objectCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restObjectCategoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(objectCategory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateObjectCategoryWithPatch() throws Exception {
        // Initialize the database
        objectCategoryRepository.saveAndFlush(objectCategory);

        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();

        // Update the objectCategory using partial update
        ObjectCategory partialUpdatedObjectCategory = new ObjectCategory();
        partialUpdatedObjectCategory.setId(objectCategory.getId());

        restObjectCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedObjectCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedObjectCategory))
            )
            .andExpect(status().isOk());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
        ObjectCategory testObjectCategory = objectCategoryList.get(objectCategoryList.size() - 1);
        assertThat(testObjectCategory.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateObjectCategoryWithPatch() throws Exception {
        // Initialize the database
        objectCategoryRepository.saveAndFlush(objectCategory);

        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();

        // Update the objectCategory using partial update
        ObjectCategory partialUpdatedObjectCategory = new ObjectCategory();
        partialUpdatedObjectCategory.setId(objectCategory.getId());

        partialUpdatedObjectCategory.name(UPDATED_NAME);

        restObjectCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedObjectCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedObjectCategory))
            )
            .andExpect(status().isOk());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
        ObjectCategory testObjectCategory = objectCategoryList.get(objectCategoryList.size() - 1);
        assertThat(testObjectCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingObjectCategory() throws Exception {
        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();
        objectCategory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restObjectCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, objectCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchObjectCategory() throws Exception {
        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();
        objectCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restObjectCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isBadRequest());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamObjectCategory() throws Exception {
        int databaseSizeBeforeUpdate = objectCategoryRepository.findAll().size();
        objectCategory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restObjectCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(objectCategory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ObjectCategory in the database
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteObjectCategory() throws Exception {
        // Initialize the database
        objectCategoryRepository.saveAndFlush(objectCategory);

        int databaseSizeBeforeDelete = objectCategoryRepository.findAll().size();

        // Delete the objectCategory
        restObjectCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, objectCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ObjectCategory> objectCategoryList = objectCategoryRepository.findAll();
        assertThat(objectCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
