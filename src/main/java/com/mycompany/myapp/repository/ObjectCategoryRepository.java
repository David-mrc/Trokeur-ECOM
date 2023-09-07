package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ObjectCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ObjectCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ObjectCategoryRepository extends JpaRepository<ObjectCategory, Long> {}
