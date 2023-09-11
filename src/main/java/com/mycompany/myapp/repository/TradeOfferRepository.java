package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeOffer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TradeOffer entity.
 *
 * When extending this class, extend TradeOfferRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface TradeOfferRepository extends TradeOfferRepositoryWithBagRelationships, JpaRepository<TradeOffer, Long> {
    default Optional<TradeOffer> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<TradeOffer> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<TradeOffer> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    @Query("select trockeurUser.tradeOffers from TrockeurUser trockeurUser where trockeurUser.user.login = :login")
    Optional<List<TradeOffer>> findAllOffersOfUser(@Param("login") Optional<String> login);
}
