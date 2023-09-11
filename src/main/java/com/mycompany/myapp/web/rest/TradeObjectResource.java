package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TradeObject;
import com.mycompany.myapp.repository.TradeObjectRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.TradeObject}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TradeObjectResource {

    private final Logger log = LoggerFactory.getLogger(TradeObjectResource.class);

    private static final String ENTITY_NAME = "tradeObject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TradeObjectRepository tradeObjectRepository;

    public TradeObjectResource(TradeObjectRepository tradeObjectRepository) {
        this.tradeObjectRepository = tradeObjectRepository;
    }

    /**
     * {@code POST  /trade-objects} : Create a new tradeObject.
     *
     * @param tradeObject the tradeObject to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tradeObject, or with status {@code 400 (Bad Request)} if the tradeObject has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trade-objects")
    public ResponseEntity<TradeObject> createTradeObject(@Valid @RequestBody TradeObject tradeObject) throws URISyntaxException {
        log.debug("REST request to save TradeObject : {}", tradeObject);
        if (tradeObject.getId() != null) {
            throw new BadRequestAlertException("A new tradeObject cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TradeObject result = tradeObjectRepository.save(tradeObject);
        return ResponseEntity
            .created(new URI("/api/trade-objects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trade-objects/:id} : Updates an existing tradeObject.
     *
     * @param id the id of the tradeObject to save.
     * @param tradeObject the tradeObject to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tradeObject,
     * or with status {@code 400 (Bad Request)} if the tradeObject is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tradeObject couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trade-objects/{id}")
    public ResponseEntity<TradeObject> updateTradeObject(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TradeObject tradeObject
    ) throws URISyntaxException {
        log.debug("REST request to update TradeObject : {}, {}", id, tradeObject);
        if (tradeObject.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tradeObject.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tradeObjectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TradeObject result = tradeObjectRepository.save(tradeObject);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tradeObject.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trade-objects/:id} : Partial updates given fields of an existing tradeObject, field will ignore if it is null
     *
     * @param id the id of the tradeObject to save.
     * @param tradeObject the tradeObject to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tradeObject,
     * or with status {@code 400 (Bad Request)} if the tradeObject is not valid,
     * or with status {@code 404 (Not Found)} if the tradeObject is not found,
     * or with status {@code 500 (Internal Server Error)} if the tradeObject couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trade-objects/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TradeObject> partialUpdateTradeObject(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TradeObject tradeObject
    ) throws URISyntaxException {
        log.debug("REST request to partial update TradeObject partially : {}, {}", id, tradeObject);
        if (tradeObject.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tradeObject.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tradeObjectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TradeObject> result = tradeObjectRepository
            .findById(tradeObject.getId())
            .map(existingTradeObject -> {
                if (tradeObject.getName() != null) {
                    existingTradeObject.setName(tradeObject.getName());
                }
                if (tradeObject.getDescription() != null) {
                    existingTradeObject.setDescription(tradeObject.getDescription());
                }
                if (tradeObject.getState() != null) {
                    existingTradeObject.setState(tradeObject.getState());
                }
                if (tradeObject.getStock() != null) {
                    existingTradeObject.setStock(tradeObject.getStock());
                }

                return existingTradeObject;
            })
            .map(tradeObjectRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tradeObject.getId().toString())
        );
    }

    /**
     * {@code GET  /trade-objects} : get all the tradeObjects.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tradeObjects in body.
     */
    @GetMapping("/trade-objects")
    public List<TradeObject> getAllTradeObjects(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TradeObjects");
        if (eagerload) {
            return tradeObjectRepository.findAllWithEagerRelationships();
        } else {
            return tradeObjectRepository.findAll();
        }
    }

    /**
     * {@code GET  /trade-objects/:id} : get the "id" tradeObject.
     *
     * @param id the id of the tradeObject to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tradeObject, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trade-objects/{id}")
    public ResponseEntity<TradeObject> getTradeObject(@PathVariable Long id) {
        log.debug("REST request to get TradeObject : {}", id);
        Optional<TradeObject> tradeObject = tradeObjectRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(tradeObject);
    }

    /**
     * {@code DELETE  /trade-objects/:id} : delete the "id" tradeObject.
     *
     * @param id the id of the tradeObject to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trade-objects/{id}")
    public ResponseEntity<Void> deleteTradeObject(@PathVariable Long id) {
        log.debug("REST request to delete TradeObject : {}", id);
        tradeObjectRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /current-trockeur-user-trade-objects : get the trade objects of the current user
     *
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @GetMapping("/current-trockeur-user-trade-objects")
    public ResponseEntity<List<TradeObject>> getMyTradeObjects() {
        log.debug("REST request to get my TradeObject");
        Optional<List<TradeObject>> allUserObjects = tradeObjectRepository.findAllObjectsOfUser(SecurityUtils.getCurrentUserLogin());
        return ResponseUtil.wrapOrNotFound(allUserObjects);
    }

    /**
     * {@code GET  /category-trade-objects/:categoryId} : get the trade objects of the category
     *
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @GetMapping("/category-trade-objects/{categoryId}")
    public ResponseEntity<Set<TradeObject>> getObjectsOfCategory(@PathVariable Optional<Long> categoryId) {
        log.debug("REST request to get TradeObject of category");
        Optional<Set<TradeObject>> objectsOfCategory = tradeObjectRepository.findObjectsOfCategory(categoryId);
        return ResponseUtil.wrapOrNotFound(objectsOfCategory);
    }

}
