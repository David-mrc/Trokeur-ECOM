package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.GenericImage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GenericImage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GenericImageRepository extends JpaRepository<GenericImage, Long> {}
