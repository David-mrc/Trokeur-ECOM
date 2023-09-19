package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeOffer;
import com.mycompany.myapp.domain.enumeration.TradeOfferState;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    @Query(value = "select trade_offer.id from rel_trade_offer__trockeur_user trade_trockeur " +
    "join trade_offer on trade_trockeur.trade_offer_id = trade_offer.id " +
    "join trockeur_user on trade_trockeur.trockeur_user_id = trockeur_user.id " +
    "where trade_offer.state != 'EN_COURS' " +
    "and trockeur_user.id = :userID",
    nativeQuery = true)
    Optional<Set<Long>> findAllNonPendingOffersOfUser(@Param("userID") Optional<Long> userID);

    @Query(value = "select trade_offer.id from rel_trade_offer__trockeur_user trade_trockeur " +
    "join trade_offer on trade_trockeur.trade_offer_id = trade_offer.id " +
    "join trockeur_user on trade_trockeur.trockeur_user_id = trockeur_user.id " +
    "where trade_offer.state = 'EN_COURS' " +
    "and trade_offer.owner_id = :userID",
    nativeQuery = true)
    Optional<Set<Long>> findAllPendingOffersFromUser(@Param("userID") Optional<Long> userID);

    @Query(value = "select trade_offer.id from rel_trade_offer__trockeur_user trade_trockeur " +
    "join trade_offer on trade_trockeur.trade_offer_id = trade_offer.id " +
    "join trockeur_user on trade_trockeur.trockeur_user_id = trockeur_user.id " +
    "where trade_offer.state = 'EN_COURS' " +
    "and trockeur_user.id = :userID " +
    "and trade_offer.owner_id != :userID",
    nativeQuery = true)
    Optional<Set<Long>> findAllPendingOffersToUser(@Param("userID") Optional<Long> userID);

    @Modifying
    @Query("delete from TradeOffer tradeOffer where tradeOffer.id = :id")
    void deleteTradeOffer(@Param("id") Long id);

    @Modifying
    @Query("update TradeOffer tradeOffer set tradeOffer.state = :state where tradeOffer.id = :id")
    void updateTradeOfferState(@Param("id") Long id, @Param("state") TradeOfferState state);
}
