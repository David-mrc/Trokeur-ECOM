package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TrockeurUser;
import com.mycompany.myapp.repository.TrockeurUserRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.TrockeurUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TrockeurUserResource {

    private final Logger log = LoggerFactory.getLogger(TrockeurUserResource.class);

    private static final String ENTITY_NAME = "trockeurUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TrockeurUserRepository trockeurUserRepository;

    public TrockeurUserResource(TrockeurUserRepository trockeurUserRepository) {
        this.trockeurUserRepository = trockeurUserRepository;
    }

    /**
     * {@code POST  /trockeur-users} : Create a new trockeurUser.
     *
     * @param trockeurUser the trockeurUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new trockeurUser, or with status {@code 400 (Bad Request)} if the trockeurUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trockeur-users")
    public ResponseEntity<TrockeurUser> createTrockeurUser(@Valid @RequestBody TrockeurUser trockeurUser) throws URISyntaxException {
        log.debug("REST request to save TrockeurUser : {}", trockeurUser);
        if (trockeurUser.getId() != null) {
            throw new BadRequestAlertException("A new trockeurUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TrockeurUser result = trockeurUserRepository.save(trockeurUser);
        return ResponseEntity
            .created(new URI("/api/trockeur-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trockeur-users/:id} : Updates an existing trockeurUser.
     *
     * @param id the id of the trockeurUser to save.
     * @param trockeurUser the trockeurUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trockeurUser,
     * or with status {@code 400 (Bad Request)} if the trockeurUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the trockeurUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trockeur-users/{id}")
    public ResponseEntity<TrockeurUser> updateTrockeurUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TrockeurUser trockeurUser
    ) throws URISyntaxException {
        log.debug("REST request to update TrockeurUser : {}, {}", id, trockeurUser);
        if (trockeurUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trockeurUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trockeurUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TrockeurUser result = trockeurUserRepository.save(trockeurUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trockeurUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trockeur-users/:id} : Partial updates given fields of an existing trockeurUser, field will ignore if it is null
     *
     * @param id the id of the trockeurUser to save.
     * @param trockeurUser the trockeurUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trockeurUser,
     * or with status {@code 400 (Bad Request)} if the trockeurUser is not valid,
     * or with status {@code 404 (Not Found)} if the trockeurUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the trockeurUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trockeur-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TrockeurUser> partialUpdateTrockeurUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TrockeurUser trockeurUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update TrockeurUser partially : {}, {}", id, trockeurUser);
        if (trockeurUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trockeurUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trockeurUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TrockeurUser> result = trockeurUserRepository
            .findById(trockeurUser.getId())
            .map(existingTrockeurUser -> {
                if (trockeurUser.getAddress() != null) {
                    existingTrockeurUser.setAddress(trockeurUser.getAddress());
                }
                if (trockeurUser.getZipCode() != null) {
                    existingTrockeurUser.setZipCode(trockeurUser.getZipCode());
                }
                if (trockeurUser.getDescription() != null) {
                    existingTrockeurUser.setDescription(trockeurUser.getDescription());
                }
                if (trockeurUser.getProfilePicturePath() != null) {
                    existingTrockeurUser.setProfilePicturePath(trockeurUser.getProfilePicturePath());
                }

                return existingTrockeurUser;
            })
            .map(trockeurUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trockeurUser.getId().toString())
        );
    }

    /**
     * {@code GET  /trockeur-users} : get all the trockeurUsers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trockeurUsers in body.
     */
    @GetMapping("/trockeur-users")
    public List<TrockeurUser> getAllTrockeurUsers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all TrockeurUsers");
        if (eagerload) {
            return trockeurUserRepository.findAllWithEagerRelationships();
        } else {
            return trockeurUserRepository.findAll();
        }
    }

    /**
     * {@code GET  /trockeur-users/:id} : get the "id" trockeurUser.
     *
     * @param id the id of the trockeurUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the trockeurUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trockeur-users/{id}")
    public ResponseEntity<TrockeurUser> getTrockeurUser(@PathVariable Long id) {
        log.debug("REST request to get TrockeurUser : {}", id);
        Optional<TrockeurUser> trockeurUser = trockeurUserRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(trockeurUser);
    }

    /**
     * {@code DELETE  /trockeur-users/:id} : delete the "id" trockeurUser.
     *
     * @param id the id of the trockeurUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trockeur-users/{id}")
    public ResponseEntity<Void> deleteTrockeurUser(@PathVariable Long id) {
        log.debug("REST request to delete TrockeurUser : {}", id);
        trockeurUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
