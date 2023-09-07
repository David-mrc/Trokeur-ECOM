package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TrockeurUser;
import com.mycompany.myapp.repository.TrockeurUserRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TrockeurUserResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TrockeurUserResourceIT {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_ZIP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ZIP_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_PROFILE_PICTURE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_PROFILE_PICTURE_PATH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/trockeur-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrockeurUserRepository trockeurUserRepository;

    @Mock
    private TrockeurUserRepository trockeurUserRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrockeurUserMockMvc;

    private TrockeurUser trockeurUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TrockeurUser createEntity(EntityManager em) {
        TrockeurUser trockeurUser = new TrockeurUser()
            .address(DEFAULT_ADDRESS)
            .zipCode(DEFAULT_ZIP_CODE)
            .description(DEFAULT_DESCRIPTION)
            .profilePicturePath(DEFAULT_PROFILE_PICTURE_PATH);
        return trockeurUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TrockeurUser createUpdatedEntity(EntityManager em) {
        TrockeurUser trockeurUser = new TrockeurUser()
            .address(UPDATED_ADDRESS)
            .zipCode(UPDATED_ZIP_CODE)
            .description(UPDATED_DESCRIPTION)
            .profilePicturePath(UPDATED_PROFILE_PICTURE_PATH);
        return trockeurUser;
    }

    @BeforeEach
    public void initTest() {
        trockeurUser = createEntity(em);
    }

    @Test
    @Transactional
    void createTrockeurUser() throws Exception {
        int databaseSizeBeforeCreate = trockeurUserRepository.findAll().size();
        // Create the TrockeurUser
        restTrockeurUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trockeurUser)))
            .andExpect(status().isCreated());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeCreate + 1);
        TrockeurUser testTrockeurUser = trockeurUserList.get(trockeurUserList.size() - 1);
        assertThat(testTrockeurUser.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testTrockeurUser.getZipCode()).isEqualTo(DEFAULT_ZIP_CODE);
        assertThat(testTrockeurUser.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTrockeurUser.getProfilePicturePath()).isEqualTo(DEFAULT_PROFILE_PICTURE_PATH);
    }

    @Test
    @Transactional
    void createTrockeurUserWithExistingId() throws Exception {
        // Create the TrockeurUser with an existing ID
        trockeurUser.setId(1L);

        int databaseSizeBeforeCreate = trockeurUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrockeurUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trockeurUser)))
            .andExpect(status().isBadRequest());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = trockeurUserRepository.findAll().size();
        // set the field null
        trockeurUser.setAddress(null);

        // Create the TrockeurUser, which fails.

        restTrockeurUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trockeurUser)))
            .andExpect(status().isBadRequest());

        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkZipCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = trockeurUserRepository.findAll().size();
        // set the field null
        trockeurUser.setZipCode(null);

        // Create the TrockeurUser, which fails.

        restTrockeurUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trockeurUser)))
            .andExpect(status().isBadRequest());

        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTrockeurUsers() throws Exception {
        // Initialize the database
        trockeurUserRepository.saveAndFlush(trockeurUser);

        // Get all the trockeurUserList
        restTrockeurUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trockeurUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].zipCode").value(hasItem(DEFAULT_ZIP_CODE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].profilePicturePath").value(hasItem(DEFAULT_PROFILE_PICTURE_PATH)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTrockeurUsersWithEagerRelationshipsIsEnabled() throws Exception {
        when(trockeurUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTrockeurUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(trockeurUserRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTrockeurUsersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(trockeurUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTrockeurUserMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(trockeurUserRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTrockeurUser() throws Exception {
        // Initialize the database
        trockeurUserRepository.saveAndFlush(trockeurUser);

        // Get the trockeurUser
        restTrockeurUserMockMvc
            .perform(get(ENTITY_API_URL_ID, trockeurUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trockeurUser.getId().intValue()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.zipCode").value(DEFAULT_ZIP_CODE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.profilePicturePath").value(DEFAULT_PROFILE_PICTURE_PATH));
    }

    @Test
    @Transactional
    void getNonExistingTrockeurUser() throws Exception {
        // Get the trockeurUser
        restTrockeurUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTrockeurUser() throws Exception {
        // Initialize the database
        trockeurUserRepository.saveAndFlush(trockeurUser);

        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();

        // Update the trockeurUser
        TrockeurUser updatedTrockeurUser = trockeurUserRepository.findById(trockeurUser.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTrockeurUser are not directly saved in db
        em.detach(updatedTrockeurUser);
        updatedTrockeurUser
            .address(UPDATED_ADDRESS)
            .zipCode(UPDATED_ZIP_CODE)
            .description(UPDATED_DESCRIPTION)
            .profilePicturePath(UPDATED_PROFILE_PICTURE_PATH);

        restTrockeurUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrockeurUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrockeurUser))
            )
            .andExpect(status().isOk());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
        TrockeurUser testTrockeurUser = trockeurUserList.get(trockeurUserList.size() - 1);
        assertThat(testTrockeurUser.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testTrockeurUser.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testTrockeurUser.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTrockeurUser.getProfilePicturePath()).isEqualTo(UPDATED_PROFILE_PICTURE_PATH);
    }

    @Test
    @Transactional
    void putNonExistingTrockeurUser() throws Exception {
        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();
        trockeurUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrockeurUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trockeurUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trockeurUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTrockeurUser() throws Exception {
        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();
        trockeurUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrockeurUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trockeurUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTrockeurUser() throws Exception {
        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();
        trockeurUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrockeurUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trockeurUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrockeurUserWithPatch() throws Exception {
        // Initialize the database
        trockeurUserRepository.saveAndFlush(trockeurUser);

        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();

        // Update the trockeurUser using partial update
        TrockeurUser partialUpdatedTrockeurUser = new TrockeurUser();
        partialUpdatedTrockeurUser.setId(trockeurUser.getId());

        partialUpdatedTrockeurUser
            .zipCode(UPDATED_ZIP_CODE)
            .description(UPDATED_DESCRIPTION)
            .profilePicturePath(UPDATED_PROFILE_PICTURE_PATH);

        restTrockeurUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrockeurUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrockeurUser))
            )
            .andExpect(status().isOk());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
        TrockeurUser testTrockeurUser = trockeurUserList.get(trockeurUserList.size() - 1);
        assertThat(testTrockeurUser.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testTrockeurUser.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testTrockeurUser.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTrockeurUser.getProfilePicturePath()).isEqualTo(UPDATED_PROFILE_PICTURE_PATH);
    }

    @Test
    @Transactional
    void fullUpdateTrockeurUserWithPatch() throws Exception {
        // Initialize the database
        trockeurUserRepository.saveAndFlush(trockeurUser);

        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();

        // Update the trockeurUser using partial update
        TrockeurUser partialUpdatedTrockeurUser = new TrockeurUser();
        partialUpdatedTrockeurUser.setId(trockeurUser.getId());

        partialUpdatedTrockeurUser
            .address(UPDATED_ADDRESS)
            .zipCode(UPDATED_ZIP_CODE)
            .description(UPDATED_DESCRIPTION)
            .profilePicturePath(UPDATED_PROFILE_PICTURE_PATH);

        restTrockeurUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrockeurUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrockeurUser))
            )
            .andExpect(status().isOk());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
        TrockeurUser testTrockeurUser = trockeurUserList.get(trockeurUserList.size() - 1);
        assertThat(testTrockeurUser.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testTrockeurUser.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testTrockeurUser.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTrockeurUser.getProfilePicturePath()).isEqualTo(UPDATED_PROFILE_PICTURE_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingTrockeurUser() throws Exception {
        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();
        trockeurUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrockeurUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trockeurUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trockeurUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTrockeurUser() throws Exception {
        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();
        trockeurUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrockeurUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trockeurUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTrockeurUser() throws Exception {
        int databaseSizeBeforeUpdate = trockeurUserRepository.findAll().size();
        trockeurUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrockeurUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(trockeurUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TrockeurUser in the database
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTrockeurUser() throws Exception {
        // Initialize the database
        trockeurUserRepository.saveAndFlush(trockeurUser);

        int databaseSizeBeforeDelete = trockeurUserRepository.findAll().size();

        // Delete the trockeurUser
        restTrockeurUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, trockeurUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TrockeurUser> trockeurUserList = trockeurUserRepository.findAll();
        assertThat(trockeurUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
