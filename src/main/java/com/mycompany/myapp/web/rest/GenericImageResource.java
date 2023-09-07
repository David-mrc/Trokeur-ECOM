package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.GenericImage;
import com.mycompany.myapp.repository.GenericImageRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.GenericImage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GenericImageResource {

    private final Logger log = LoggerFactory.getLogger(GenericImageResource.class);

    private static final String ENTITY_NAME = "genericImage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GenericImageRepository genericImageRepository;

    public GenericImageResource(GenericImageRepository genericImageRepository) {
        this.genericImageRepository = genericImageRepository;
    }

    /**
     * {@code POST  /generic-images} : Create a new genericImage.
     *
     * @param genericImage the genericImage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new genericImage, or with status {@code 400 (Bad Request)} if the genericImage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/generic-images")
    public ResponseEntity<GenericImage> createGenericImage(@Valid @RequestBody GenericImage genericImage) throws URISyntaxException {
        log.debug("REST request to save GenericImage : {}", genericImage);
        if (genericImage.getId() != null) {
            throw new BadRequestAlertException("A new genericImage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GenericImage result = genericImageRepository.save(genericImage);
        return ResponseEntity
            .created(new URI("/api/generic-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /generic-images/:id} : Updates an existing genericImage.
     *
     * @param id the id of the genericImage to save.
     * @param genericImage the genericImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genericImage,
     * or with status {@code 400 (Bad Request)} if the genericImage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the genericImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/generic-images/{id}")
    public ResponseEntity<GenericImage> updateGenericImage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GenericImage genericImage
    ) throws URISyntaxException {
        log.debug("REST request to update GenericImage : {}, {}", id, genericImage);
        if (genericImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, genericImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!genericImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GenericImage result = genericImageRepository.save(genericImage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genericImage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /generic-images/:id} : Partial updates given fields of an existing genericImage, field will ignore if it is null
     *
     * @param id the id of the genericImage to save.
     * @param genericImage the genericImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated genericImage,
     * or with status {@code 400 (Bad Request)} if the genericImage is not valid,
     * or with status {@code 404 (Not Found)} if the genericImage is not found,
     * or with status {@code 500 (Internal Server Error)} if the genericImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/generic-images/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GenericImage> partialUpdateGenericImage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GenericImage genericImage
    ) throws URISyntaxException {
        log.debug("REST request to partial update GenericImage partially : {}, {}", id, genericImage);
        if (genericImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, genericImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!genericImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GenericImage> result = genericImageRepository
            .findById(genericImage.getId())
            .map(existingGenericImage -> {
                if (genericImage.getImagePath() != null) {
                    existingGenericImage.setImagePath(genericImage.getImagePath());
                }

                return existingGenericImage;
            })
            .map(genericImageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, genericImage.getId().toString())
        );
    }

    /**
     * {@code GET  /generic-images} : get all the genericImages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of genericImages in body.
     */
    @GetMapping("/generic-images")
    public List<GenericImage> getAllGenericImages() {
        log.debug("REST request to get all GenericImages");
        return genericImageRepository.findAll();
    }

    /**
     * {@code GET  /generic-images/:id} : get the "id" genericImage.
     *
     * @param id the id of the genericImage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the genericImage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/generic-images/{id}")
    public ResponseEntity<GenericImage> getGenericImage(@PathVariable Long id) {
        log.debug("REST request to get GenericImage : {}", id);
        Optional<GenericImage> genericImage = genericImageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(genericImage);
    }

    /**
     * {@code DELETE  /generic-images/:id} : delete the "id" genericImage.
     *
     * @param id the id of the genericImage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/generic-images/{id}")
    public ResponseEntity<Void> deleteGenericImage(@PathVariable Long id) {
        log.debug("REST request to delete GenericImage : {}", id);
        genericImageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
