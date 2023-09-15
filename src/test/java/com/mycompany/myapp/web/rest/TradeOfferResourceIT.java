package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TradeOffer;
import com.mycompany.myapp.domain.enumeration.TradeOfferState;
import com.mycompany.myapp.repository.TradeOfferRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link TradeOfferResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TradeOfferResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final TradeOfferState DEFAULT_STATE = TradeOfferState.EN_COURS;
    private static final TradeOfferState UPDATED_STATE = TradeOfferState.ACCEPTE;

    private static final Long DEFAULT_OWNER_ID = 1L;
    private static final Long UPDATED_OWNER_ID = 2L;

    private static final String ENTITY_API_URL = "/api/trade-offers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TradeOfferRepository tradeOfferRepository;

    @Mock
    private TradeOfferRepository tradeOfferRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTradeOfferMockMvc;

    private TradeOffer tradeOffer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TradeOffer createEntity(EntityManager em) {
        TradeOffer tradeOffer = new TradeOffer().date(DEFAULT_DATE).state(DEFAULT_STATE).ownerID(DEFAULT_OWNER_ID);
        return tradeOffer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TradeOffer createUpdatedEntity(EntityManager em) {
        TradeOffer tradeOffer = new TradeOffer().date(UPDATED_DATE).state(UPDATED_STATE).ownerID(UPDATED_OWNER_ID);
        return tradeOffer;
    }

    @BeforeEach
    public void initTest() {
        tradeOffer = createEntity(em);
    }

    @Test
    @Transactional
    void createTradeOffer() throws Exception {
        int databaseSizeBeforeCreate = tradeOfferRepository.findAll().size();
        // Create the TradeOffer
        restTradeOfferMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeOffer)))
            .andExpect(status().isCreated());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeCreate + 1);
        TradeOffer testTradeOffer = tradeOfferList.get(tradeOfferList.size() - 1);
        assertThat(testTradeOffer.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testTradeOffer.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testTradeOffer.getOwnerID()).isEqualTo(DEFAULT_OWNER_ID);
    }

    @Test
    @Transactional
    void createTradeOfferWithExistingId() throws Exception {
        // Create the TradeOffer with an existing ID
        tradeOffer.setId(1L);

        int databaseSizeBeforeCreate = tradeOfferRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTradeOfferMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeOffer)))
            .andExpect(status().isBadRequest());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = tradeOfferRepository.findAll().size();
        // set the field null
        tradeOffer.setDate(null);

        // Create the TradeOffer, which fails.

        restTradeOfferMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeOffer)))
            .andExpect(status().isBadRequest());

        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStateIsRequired() throws Exception {
        int databaseSizeBeforeTest = tradeOfferRepository.findAll().size();
        // set the field null
        tradeOffer.setState(null);

        // Create the TradeOffer, which fails.

        restTradeOfferMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeOffer)))
            .andExpect(status().isBadRequest());

        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTradeOffers() throws Exception {
        // Initialize the database
        tradeOfferRepository.saveAndFlush(tradeOffer);

        // Get all the tradeOfferList
        restTradeOfferMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tradeOffer.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].ownerID").value(hasItem(DEFAULT_OWNER_ID.intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTradeOffersWithEagerRelationshipsIsEnabled() throws Exception {
        when(tradeOfferRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTradeOfferMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(tradeOfferRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTradeOffersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(tradeOfferRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTradeOfferMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(tradeOfferRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTradeOffer() throws Exception {
        // Initialize the database
        tradeOfferRepository.saveAndFlush(tradeOffer);

        // Get the tradeOffer
        restTradeOfferMockMvc
            .perform(get(ENTITY_API_URL_ID, tradeOffer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tradeOffer.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.ownerID").value(DEFAULT_OWNER_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingTradeOffer() throws Exception {
        // Get the tradeOffer
        restTradeOfferMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTradeOffer() throws Exception {
        // Initialize the database
        tradeOfferRepository.saveAndFlush(tradeOffer);

        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();

        // Update the tradeOffer
        TradeOffer updatedTradeOffer = tradeOfferRepository.findById(tradeOffer.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTradeOffer are not directly saved in db
        em.detach(updatedTradeOffer);
        updatedTradeOffer.date(UPDATED_DATE).state(UPDATED_STATE).ownerID(UPDATED_OWNER_ID);

        restTradeOfferMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTradeOffer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTradeOffer))
            )
            .andExpect(status().isOk());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
        TradeOffer testTradeOffer = tradeOfferList.get(tradeOfferList.size() - 1);
        assertThat(testTradeOffer.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testTradeOffer.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testTradeOffer.getOwnerID()).isEqualTo(UPDATED_OWNER_ID);
    }

    @Test
    @Transactional
    void putNonExistingTradeOffer() throws Exception {
        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();
        tradeOffer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTradeOfferMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tradeOffer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tradeOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTradeOffer() throws Exception {
        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();
        tradeOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeOfferMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tradeOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTradeOffer() throws Exception {
        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();
        tradeOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeOfferMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tradeOffer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTradeOfferWithPatch() throws Exception {
        // Initialize the database
        tradeOfferRepository.saveAndFlush(tradeOffer);

        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();

        // Update the tradeOffer using partial update
        TradeOffer partialUpdatedTradeOffer = new TradeOffer();
        partialUpdatedTradeOffer.setId(tradeOffer.getId());

        partialUpdatedTradeOffer.ownerID(UPDATED_OWNER_ID);

        restTradeOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTradeOffer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTradeOffer))
            )
            .andExpect(status().isOk());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
        TradeOffer testTradeOffer = tradeOfferList.get(tradeOfferList.size() - 1);
        assertThat(testTradeOffer.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testTradeOffer.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testTradeOffer.getOwnerID()).isEqualTo(UPDATED_OWNER_ID);
    }

    @Test
    @Transactional
    void fullUpdateTradeOfferWithPatch() throws Exception {
        // Initialize the database
        tradeOfferRepository.saveAndFlush(tradeOffer);

        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();

        // Update the tradeOffer using partial update
        TradeOffer partialUpdatedTradeOffer = new TradeOffer();
        partialUpdatedTradeOffer.setId(tradeOffer.getId());

        partialUpdatedTradeOffer.date(UPDATED_DATE).state(UPDATED_STATE).ownerID(UPDATED_OWNER_ID);

        restTradeOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTradeOffer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTradeOffer))
            )
            .andExpect(status().isOk());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
        TradeOffer testTradeOffer = tradeOfferList.get(tradeOfferList.size() - 1);
        assertThat(testTradeOffer.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testTradeOffer.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testTradeOffer.getOwnerID()).isEqualTo(UPDATED_OWNER_ID);
    }

    @Test
    @Transactional
    void patchNonExistingTradeOffer() throws Exception {
        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();
        tradeOffer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTradeOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tradeOffer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tradeOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTradeOffer() throws Exception {
        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();
        tradeOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tradeOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTradeOffer() throws Exception {
        int databaseSizeBeforeUpdate = tradeOfferRepository.findAll().size();
        tradeOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTradeOfferMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tradeOffer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TradeOffer in the database
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTradeOffer() throws Exception {
        // Initialize the database
        tradeOfferRepository.saveAndFlush(tradeOffer);

        int databaseSizeBeforeDelete = tradeOfferRepository.findAll().size();

        // Delete the tradeOffer
        restTradeOfferMockMvc
            .perform(delete(ENTITY_API_URL_ID, tradeOffer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TradeOffer> tradeOfferList = tradeOfferRepository.findAll();
        assertThat(tradeOfferList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
