package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TradeObject;
import com.mycompany.myapp.domain.enumeration.TradeObjectState;
import com.mycompany.myapp.repository.TradeObjectRepository;
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
 * Integration tests for the {@link TradeObjectResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TradeObjectResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final TradeObjectState DEFAULT_STATE = TradeObjectState.Neuf;
    private static final TradeObjectState UPDATED_STATE = TradeObjectState.Bon;

    private static final Integer DEFAULT_STOCK = 1;
    private static final Integer UPDATED_STOCK = 2;

    private static final String ENTITY_API_URL = "/api/trade-objects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TradeObjectRepository tradeObjectRepository;

    @Mock
    private TradeObjectRepository tradeObjectRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTradeObjectMockMvc;

    private TradeObject tradeObject;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TradeObject createEntity(EntityManager em) {
        TradeObject tradeObject = new TradeObject()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .state(DEFAULT_STATE)
            .stock(DEFAULT_STOCK);
        return tradeObject;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TradeObject createUpdatedEntity(EntityManager em) {
        TradeObject tradeObject = new TradeObject()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .state(UPDATED_STATE)
            .stock(UPDATED_STOCK);
        return tradeObject;
    }

    @BeforeEach
    public void initTest() {
        tradeObject = createEntity(em);
    }

    @Test
    @Transactional
    void createTradeObject() throws Exception {
        int databaseSizeBeforeCreate = tradeObjectRepository.findAll().size();
        // Create the TradeObject
        restTradeObjectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeObject)))
            .andExpect(status().isCreated());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeCreate + 1);
        TradeObject testTradeObject = tradeObjectList.get(tradeObjectList.size() - 1);
        assertThat(testTradeObject.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTradeObject.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTradeObject.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testTradeObject.getStock()).isEqualTo(DEFAULT_STOCK);
    }

    @Test
    @Transactional
    void createTradeObjectWithExistingId() throws Exception {
        // Create the TradeObject with an existing ID
        tradeObject.setId(1L);

        int databaseSizeBeforeCreate = tradeObjectRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTradeObjectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeObject)))
            .andExpect(status().isBadRequest());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tradeObjectRepository.findAll().size();
        // set the field null
        tradeObject.setName(null);

        // Create the TradeObject, which fails.

        restTradeObjectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeObject)))
            .andExpect(status().isBadRequest());

        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStateIsRequired() throws Exception {
        int databaseSizeBeforeTest = tradeObjectRepository.findAll().size();
        // set the field null
        tradeObject.setState(null);

        // Create the TradeObject, which fails.

        restTradeObjectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeObject)))
            .andExpect(status().isBadRequest());

        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStockIsRequired() throws Exception {
        int databaseSizeBeforeTest = tradeObjectRepository.findAll().size();
        // set the field null
        tradeObject.setStock(null);

        // Create the TradeObject, which fails.

        restTradeObjectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeObject)))
            .andExpect(status().isBadRequest());

        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTradeObjects() throws Exception {
        // Initialize the database
        tradeObjectRepository.saveAndFlush(tradeObject);

        // Get all the tradeObjectList
        restTradeObjectMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tradeObject.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTradeObjectsWithEagerRelationshipsIsEnabled() throws Exception {
        when(tradeObjectRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTradeObjectMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(tradeObjectRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTradeObjectsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(tradeObjectRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTradeObjectMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(tradeObjectRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTradeObject() throws Exception {
        // Initialize the database
        tradeObjectRepository.saveAndFlush(tradeObject);

        // Get the tradeObject
        restTradeObjectMockMvc
            .perform(get(ENTITY_API_URL_ID, tradeObject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tradeObject.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK));
    }

    @Test
    @Transactional
    void getNonExistingTradeObject() throws Exception {
        // Get the tradeObject
        restTradeObjectMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTradeObject() throws Exception {
        // Initialize the database
        tradeObjectRepository.saveAndFlush(tradeObject);

        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();

        // Update the tradeObject
        TradeObject updatedTradeObject = tradeObjectRepository.findById(tradeObject.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTradeObject are not directly saved in db
        em.detach(updatedTradeObject);
        updatedTradeObject.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).state(UPDATED_STATE).stock(UPDATED_STOCK);

        restTradeObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTradeObject.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTradeObject))
            )
            .andExpect(status().isOk());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
        TradeObject testTradeObject = tradeObjectList.get(tradeObjectList.size() - 1);
        assertThat(testTradeObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTradeObject.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTradeObject.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testTradeObject.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void putNonExistingTradeObject() throws Exception {
        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();
        tradeObject.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTradeObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tradeObject.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tradeObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTradeObject() throws Exception {
        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();
        tradeObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tradeObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTradeObject() throws Exception {
        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();
        tradeObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeObjectMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeObject)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTradeObjectWithPatch() throws Exception {
        // Initialize the database
        tradeObjectRepository.saveAndFlush(tradeObject);

        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();

        // Update the tradeObject using partial update
        TradeObject partialUpdatedTradeObject = new TradeObject();
        partialUpdatedTradeObject.setId(tradeObject.getId());

        partialUpdatedTradeObject.name(UPDATED_NAME);

        restTradeObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTradeObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTradeObject))
            )
            .andExpect(status().isOk());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
        TradeObject testTradeObject = tradeObjectList.get(tradeObjectList.size() - 1);
        assertThat(testTradeObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTradeObject.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTradeObject.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testTradeObject.getStock()).isEqualTo(DEFAULT_STOCK);
    }

    @Test
    @Transactional
    void fullUpdateTradeObjectWithPatch() throws Exception {
        // Initialize the database
        tradeObjectRepository.saveAndFlush(tradeObject);

        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();

        // Update the tradeObject using partial update
        TradeObject partialUpdatedTradeObject = new TradeObject();
        partialUpdatedTradeObject.setId(tradeObject.getId());

        partialUpdatedTradeObject.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).state(UPDATED_STATE).stock(UPDATED_STOCK);

        restTradeObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTradeObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTradeObject))
            )
            .andExpect(status().isOk());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
        TradeObject testTradeObject = tradeObjectList.get(tradeObjectList.size() - 1);
        assertThat(testTradeObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTradeObject.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTradeObject.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testTradeObject.getStock()).isEqualTo(UPDATED_STOCK);
    }

    @Test
    @Transactional
    void patchNonExistingTradeObject() throws Exception {
        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();
        tradeObject.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTradeObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tradeObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tradeObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTradeObject() throws Exception {
        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();
        tradeObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tradeObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTradeObject() throws Exception {
        int databaseSizeBeforeUpdate = tradeObjectRepository.findAll().size();
        tradeObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeObjectMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tradeObject))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TradeObject in the database
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTradeObject() throws Exception {
        // Initialize the database
        tradeObjectRepository.saveAndFlush(tradeObject);

        int databaseSizeBeforeDelete = tradeObjectRepository.findAll().size();

        // Delete the tradeObject
        restTradeObjectMockMvc
            .perform(delete(ENTITY_API_URL_ID, tradeObject.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TradeObject> tradeObjectList = tradeObjectRepository.findAll();
        assertThat(tradeObjectList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
