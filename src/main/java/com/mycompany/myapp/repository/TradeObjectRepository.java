package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeObject;
import com.mycompany.myapp.domain.enumeration.TradeObjectState;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    @Query("select objectCategory.tradeObjects from ObjectCategory objectCategory where objectCategory.name = :categoryName")
    Optional<Set<TradeObject>> findObjectsOfCategory(@Param("categoryName") Optional<String> categoryName);

    @Query("select tradeObject from TradeObject tradeObject where tradeObject.state = :state")
    Optional<Set<TradeObject>> findObjectsOfState(@Param("state") Optional<TradeObjectState> state);

    @Query("select tradeObject from TradeObject tradeObject where LOWER(tradeObject.name) LIKE %:searchInput%")
    Optional<Set<TradeObject>> findObjectsOfSearchInput(@Param("searchInput") String searchInput);

    @Query("select tradeObject from TradeObject tradeObject where tradeObject.stock > 0 and tradeObject.trockeurUser.user.login != :login")
    Set<TradeObject> findAllObjects(@Param("login") Optional<String> login);

    @Query("select count(tradeObject) from TradeObject tradeObject")
    Optional<Integer> countAllObjects();

    @Query(value = "select tradeObject from TradeObject tradeObject where tradeObject.stock > 0 and tradeObject.trockeurUser.user.login != :login")
    Page<TradeObject> findAllObjectsFromPage(@Param("pageable") Pageable page, @Param("login") Optional<String> login);
}
