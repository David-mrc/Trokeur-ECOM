package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TradeObject;
import com.mycompany.myapp.domain.TradeOffer;

import com.mycompany.myapp.domain.TrockeurUser;
import com.mycompany.myapp.domain.TradeObject;

import com.mycompany.myapp.domain.enumeration.TradeOfferState;
import com.mycompany.myapp.repository.TradeObjectRepository;
import com.mycompany.myapp.repository.TradeOfferRepository;
import com.mycompany.myapp.repository.TrockeurUserRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import jakarta.persistence.LockModeType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.LocalDate;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.TradeOffer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TradeOfferResource {

    private final Logger log = LoggerFactory.getLogger(TradeOfferResource.class);

    private static final String ENTITY_NAME = "tradeOffer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TradeOfferRepository tradeOfferRepository;
    private final TradeObjectRepository tradeObjectRepository;
    private final TrockeurUserRepository trockeurUserRepository;

    public TradeOfferResource(TradeOfferRepository tradeOfferRepository, TradeObjectRepository tradeObjectRepository, TrockeurUserRepository trockeurUserRepository) {
        this.tradeOfferRepository = tradeOfferRepository;
        this.tradeObjectRepository = tradeObjectRepository;
        this.trockeurUserRepository = trockeurUserRepository;
    }

    /**
     * {@code POST  /trade-offers} : Create a new tradeOffer.
     *
     * @param tradeOffer the tradeOffer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tradeOffer, or with status {@code 400 (Bad Request)} if the tradeOffer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trade-offers")
    public ResponseEntity<TradeOffer> createTradeOffer(@Valid @RequestBody TradeOffer tradeOffer) throws URISyntaxException {
        log.debug("REST request to save TradeOffer : {}", tradeOffer);
        if (tradeOffer.getId() != null) {
            throw new BadRequestAlertException("A new tradeOffer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<Long> userId = trockeurUserRepository.findTrockeurUserIdByLogin(SecurityUtils.getCurrentUserLogin());
        if (userId.isPresent()) {
            tradeOffer.setOwnerID(userId.get());
        }
        TradeOffer result = tradeOfferRepository.save(tradeOffer);
        return ResponseEntity
            .created(new URI("/api/trade-offers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trade-offers/:id} : Updates an existing tradeOffer.
     *
     * @param id the id of the tradeOffer to save.
     * @param tradeOffer the tradeOffer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tradeOffer,
     * or with status {@code 400 (Bad Request)} if the tradeOffer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tradeOffer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trade-offers/{id}")
    public ResponseEntity<TradeOffer> updateTradeOffer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TradeOffer tradeOffer
    ) throws URISyntaxException {
        log.debug("REST request to update TradeOffer : {}, {}", id, tradeOffer);
        if (tradeOffer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tradeOffer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tradeOfferRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TradeOffer result = tradeOfferRepository.save(tradeOffer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tradeOffer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trade-offers/:id} : Partial updates given fields of an existing tradeOffer, field will ignore if it is null
     *
     * @param id the id of the tradeOffer to save.
     * @param tradeOffer the tradeOffer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tradeOffer,
     * or with status {@code 400 (Bad Request)} if the tradeOffer is not valid,
     * or with status {@code 404 (Not Found)} if the tradeOffer is not found,
     * or with status {@code 500 (Internal Server Error)} if the tradeOffer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trade-offers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TradeOffer> partialUpdateTradeOffer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TradeOffer tradeOffer
    ) throws URISyntaxException {
        log.debug("REST request to partial update TradeOffer partially : {}, {}", id, tradeOffer);
        if (tradeOffer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tradeOffer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tradeOfferRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TradeOffer> result = tradeOfferRepository
            .findById(tradeOffer.getId())
            .map(existingTradeOffer -> {
                if (tradeOffer.getDate() != null) {
                    existingTradeOffer.setDate(tradeOffer.getDate());
                }
                if (tradeOffer.getState() != null) {
                    existingTradeOffer.setState(tradeOffer.getState());
                }
                if (tradeOffer.getOwnerID() != null) {
                    existingTradeOffer.setOwnerID(tradeOffer.getOwnerID());
                }

                return existingTradeOffer;
            })
            .map(tradeOfferRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tradeOffer.getId().toString())
        );
    }

    /**
     * {@code GET  /trade-offers} : get all the tradeOffers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tradeOffers in body.
     */
    @GetMapping("/trade-offers")
    public List<TradeOffer> getAllTradeOffers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TradeOffers");
        if (eagerload) {
            return tradeOfferRepository.findAllWithEagerRelationships();
        } else {
            return tradeOfferRepository.findAll();
        }
    }

    /**
     * {@code GET  /trade-offers/:id} : get the "id" tradeOffer.
     *
     * @param id the id of the tradeOffer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trade-offers/{id}")
    public ResponseEntity<TradeOffer> getTradeOffer(@PathVariable Long id) {
        log.debug("REST request to get TradeOffer : {}", id);
        Optional<TradeOffer> tradeOffer = tradeOfferRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(tradeOffer);
    }

    /**
     * {@code DELETE  /trade-offers/:id} : delete the "id" tradeOffer.
     *
     * @param id the id of the tradeOffer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trade-offers/{id}")
    public ResponseEntity<Void> deleteTradeOffer(@PathVariable Long id) {
        log.debug("REST request to delete TradeOffer : {}", id);
        tradeOfferRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /current-trockeur-user-trade-offers} : get the current user's tradeOffer(s).
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/current-trockeur-user-trade-offers")
    public ResponseEntity<List<TradeOffer>> getMyTradeOffers() {
        log.debug("REST request to get current user's TradeOffer");
        Optional<List<TradeOffer>> tradeOffers = tradeOfferRepository.findAllOffersOfUser(SecurityUtils.getCurrentUserLogin());
        return ResponseUtil.wrapOrNotFound(tradeOffers);
    }

    /**
     * {@code GET  /trade-offer/non-pending-of-user} : get the current user's non pending tradeOffer(s).
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("trade-offer/non-pending-of-user")
    public ResponseEntity<Set<TradeOffer>> getAllNonPendingOffersOfUser() {
        log.debug("REST request to get current user's non pending TradeOffers");
        Optional<Set<Long>> tradeOffersIds = tradeOfferRepository.findAllNonPendingOffersOfUser(trockeurUserRepository.findTrockeurUserIdByLogin(SecurityUtils.getCurrentUserLogin()));
        Set<TradeOffer> tradeOffers = new HashSet<>();
        for(Long id : tradeOffersIds.get()) {
            tradeOffers.add(tradeOfferRepository.findById(id).get());
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(tradeOffers));
    }

    /**
     * {@code GET  /trade-offer/pending-offered-by-user} : get the current user's non pending tradeOffer(s).
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("trade-offer/pending-offered-by-user")
    public ResponseEntity<Set<TradeOffer>> getAllPendingOffersFromUser() {
        log.debug("REST request to get current user's pending offered TradeOffers");
        Optional<Set<Long>> tradeOffersIds = tradeOfferRepository.findAllPendingOffersFromUser(trockeurUserRepository.findTrockeurUserIdByLogin(SecurityUtils.getCurrentUserLogin()));
        Set<TradeOffer> tradeOffers = new HashSet<>();
        for(Long id : tradeOffersIds.get()) {
            tradeOffers.add(tradeOfferRepository.findById(id).get());
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(tradeOffers));
    }

    /**
     * {@code GET  /trade-offer/pending-received-by-user} : get the current user's non pending tradeOffer(s).
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("trade-offer/pending-received-by-user")
    public ResponseEntity<Set<TradeOffer>> getAllPendingOffersToUser() {
        log.debug("REST request to get current user's pending received TradeOffers");
        Optional<Set<Long>> tradeOffersIds = tradeOfferRepository.findAllPendingOffersToUser(trockeurUserRepository.findTrockeurUserIdByLogin(SecurityUtils.getCurrentUserLogin()));
        Set<TradeOffer> tradeOffers = new HashSet<>();
        for(Long id : tradeOffersIds.get()) {
            tradeOffers.add(tradeOfferRepository.findById(id).get());
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(tradeOffers));
    }

    /**
     * {@code GET  /trade-offer-proposed-object/:id} : get the proposed trade object
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trade-offer-proposed-object/{id}")
    public ResponseEntity<TradeObject> getProposedTradeObject(@PathVariable Long id) {
        log.debug("REST request to get proposed trade object");
        Optional<TradeOffer> tradeOffer = tradeOfferRepository.findById(id);
        if (tradeOffer != null) {
            Set<TradeObject> tradeObjects = tradeOffer.get().getTradeObjects();
            for (TradeObject tradeObject : tradeObjects) {
                if (tradeObject.getTrockeurUser().getId() == tradeOffer.get().getOwnerID()) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(tradeObject));
                }
            }
        }
        return null;
    }

    /**
     * {@code GET  /trade-offer-wanted-object/:id} : get the proposed trade object
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trade-offer-wanted-object/{id}")
    public ResponseEntity<TradeObject> getWantedTradeObject(@PathVariable Long id) {
        log.debug("REST request to get wanted trade object");
        Optional<TradeOffer> tradeOffer = tradeOfferRepository.findById(id);
        if (tradeOffer != null) {
            for (TradeObject tradeObject : tradeOffer.get().getTradeObjects()) {
                if (tradeObject.getTrockeurUser().getId() != tradeOffer.get().getOwnerID()) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(tradeObject));
                }
            }
        }
        return null;
    }

    /**
     * {@code DELETE  /trade-offers/cancel/:id} : cancel the "id" tradeOffer.
     *
     * @param id the id of the tradeOffer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trade-offers/cancel/{id}")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public ResponseEntity<Void> cancelTradeOffer(@PathVariable Long id) {
        log.debug("REST request to cancel TradeOffer : {}", id);
        tradeOfferRepository.deleteTradeOffer(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code PUT  /trade-offers/:id} : Updates tradeOffer state from EN_COURS to REFUSE.
     *
     * @param id the id of the tradeOffer to save.
     * @param tradeOffer the tradeOffer to update.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PutMapping("/trade-offers/refuse/{id}")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public ResponseEntity<Void> refuseTradeOffer(@PathVariable Long id) {
        log.debug("REST request to refuse TradeOffer : {}", id);
        tradeOfferRepository.updateTradeOfferState(id, TradeOfferState.REFUSE);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code PUT  /trade-offers/:id} : Accepts tradeOffer if possible.
     *
     * @param id the id of the tradeOffer to save.
     * @param tradeOffer the tradeOffer to update.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PutMapping("/trade-offers/accept/{id}")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    public ResponseEntity<Boolean> acceptTradeOffer(@PathVariable Long id) {
        log.debug("REST request to accept TradeOffer : {}", id);
        Optional<TradeOffer> optTradeOffer = tradeOfferRepository.findById(id);
        if (optTradeOffer != null) {    // Checking if the trade offer still exists
            TradeOffer tradeOffer = optTradeOffer.get();
            for (TradeObject tradeObject : tradeOffer.getTradeObjects()) {  // Checking if all trade objects have at least 1 in stock
                if (tradeObject.getStock() < 1) {
                    return ResponseUtil.wrapOrNotFound(Optional.of(false));
                }
            }
            tradeOfferRepository.updateTradeOfferState(id, TradeOfferState.ACCEPTE);    // Changing trade offer state to accepted
            for (TradeObject tradeObject : tradeOffer.getTradeObjects()) {              // Deleting 1 stock for each trade object
                tradeObject.setStock(tradeObject.getStock() - 1);
                tradeObjectRepository.save(tradeObject);
            }
            return ResponseUtil.wrapOrNotFound(Optional.of(true));
        }
        return ResponseUtil.wrapOrNotFound(Optional.of(false));
    }
    /*
     * {@code GET  /trade-offers/trade} : create tradeOffer.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeOffer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trade-offers/trade")
    public void createTradeOffer(@RequestParam Long askedProductId, @RequestParam Long selectedProductId) {
        log.debug("REST request to create TradeOffer");
        TradeOffer tradeOffer = new TradeOffer();
        tradeOffer.setDate(LocalDate.now());
        tradeOffer.setState(TradeOfferState.EN_COURS);
        Long ownerID = trockeurUserRepository.findTrockeurUserIdByLogin(SecurityUtils.getCurrentUserLogin()).get();
        tradeOffer.setOwnerID(ownerID);

        Set<TradeObject> tradeObjects = new HashSet<>();
        TradeObject askedProduct = tradeObjectRepository.findById(askedProductId).get();
        tradeObjects.add(askedProduct);
        TradeObject selectedProduct = tradeObjectRepository.findById(selectedProductId).get();
        tradeObjects.add(selectedProduct);
        tradeOffer.setTradeObjects(tradeObjects);

        Set<TrockeurUser> trockeurUsers = new HashSet<>();
        TrockeurUser owner = trockeurUserRepository.findById(ownerID).get();
        trockeurUsers.add(owner);
        TrockeurUser receiver = trockeurUserRepository.findTrockeurUserByTradeObject(askedProduct.getId()).get();
        trockeurUsers.add(receiver);
        tradeOffer.setTrockeurUsers(trockeurUsers);

        tradeOfferRepository.save(tradeOffer);
    }
}
