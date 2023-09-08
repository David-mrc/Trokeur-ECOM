package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeObject;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TradeObject entity.
 *
 * When extending this class, extend TradeObjectRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface TradeObjectRepository extends TradeObjectRepositoryWithBagRelationships, JpaRepository<TradeObject, Long> {
    default Optional<TradeObject> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<TradeObject> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<TradeObject> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    //TODO : trier la liste d'objets...
    @Query("select tradeObject from TradeObject tradeObject where tradeObject.trockeurUser.user.login = :login")
    Optional<List<TradeObject>> findAllObjectsOfUser(@Param("login") Optional<String> login);
}
