package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ObjectCategory;
import com.mycompany.myapp.repository.ObjectCategoryRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ObjectCategory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ObjectCategoryResource {

    private final Logger log = LoggerFactory.getLogger(ObjectCategoryResource.class);

    private static final String ENTITY_NAME = "objectCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ObjectCategoryRepository objectCategoryRepository;

    public ObjectCategoryResource(ObjectCategoryRepository objectCategoryRepository) {
        this.objectCategoryRepository = objectCategoryRepository;
    }

    /**
     * {@code POST  /object-categories} : Create a new objectCategory.
     *
     * @param objectCategory the objectCategory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new objectCategory, or with status {@code 400 (Bad Request)} if the objectCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/object-categories")
    public ResponseEntity<ObjectCategory> createObjectCategory(@Valid @RequestBody ObjectCategory objectCategory)
        throws URISyntaxException {
        log.debug("REST request to save ObjectCategory : {}", objectCategory);
        if (objectCategory.getId() != null) {
            throw new BadRequestAlertException("A new objectCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ObjectCategory result = objectCategoryRepository.save(objectCategory);
        return ResponseEntity
            .created(new URI("/api/object-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /object-categories/:id} : Updates an existing objectCategory.
     *
     * @param id the id of the objectCategory to save.
     * @param objectCategory the objectCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated objectCategory,
     * or with status {@code 400 (Bad Request)} if the objectCategory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the objectCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/object-categories/{id}")
    public ResponseEntity<ObjectCategory> updateObjectCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ObjectCategory objectCategory
    ) throws URISyntaxException {
        log.debug("REST request to update ObjectCategory : {}, {}", id, objectCategory);
        if (objectCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, objectCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!objectCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ObjectCategory result = objectCategoryRepository.save(objectCategory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, objectCategory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /object-categories/:id} : Partial updates given fields of an existing objectCategory, field will ignore if it is null
     *
     * @param id the id of the objectCategory to save.
     * @param objectCategory the objectCategory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated objectCategory,
     * or with status {@code 400 (Bad Request)} if the objectCategory is not valid,
     * or with status {@code 404 (Not Found)} if the objectCategory is not found,
     * or with status {@code 500 (Internal Server Error)} if the objectCategory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/object-categories/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ObjectCategory> partialUpdateObjectCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ObjectCategory objectCategory
    ) throws URISyntaxException {
        log.debug("REST request to partial update ObjectCategory partially : {}, {}", id, objectCategory);
        if (objectCategory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, objectCategory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!objectCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ObjectCategory> result = objectCategoryRepository
            .findById(objectCategory.getId())
            .map(existingObjectCategory -> {
                if (objectCategory.getName() != null) {
                    existingObjectCategory.setName(objectCategory.getName());
                }

                return existingObjectCategory;
            })
            .map(objectCategoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, objectCategory.getId().toString())
        );
    }

    /**
     * {@code GET  /object-categories} : get all the objectCategories.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of objectCategories in body.
     */
    @GetMapping("/object-categories")
    public List<ObjectCategory> getAllObjectCategories() {
        log.debug("REST request to get all ObjectCategories");
        return objectCategoryRepository.findAll();
    }

    /**
     * {@code GET  /object-categories/:id} : get the "id" objectCategory.
     *
     * @param id the id of the objectCategory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the objectCategory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/object-categories/{id}")
    public ResponseEntity<ObjectCategory> getObjectCategory(@PathVariable Long id) {
        log.debug("REST request to get ObjectCategory : {}", id);
        Optional<ObjectCategory> objectCategory = objectCategoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(objectCategory);
    }

    /**
     * {@code DELETE  /object-categories/:id} : delete the "id" objectCategory.
     *
     * @param id the id of the objectCategory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/object-categories/{id}")
    public ResponseEntity<Void> deleteObjectCategory(@PathVariable Long id) {
        log.debug("REST request to delete ObjectCategory : {}", id);
        objectCategoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
