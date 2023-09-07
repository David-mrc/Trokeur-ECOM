package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeOffer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TradeOfferRepositoryWithBagRelationshipsImpl implements TradeOfferRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<TradeOffer> fetchBagRelationships(Optional<TradeOffer> tradeOffer) {
        return tradeOffer.map(this::fetchTradeObjects).map(this::fetchTrockeurUsers);
    }

    @Override
    public Page<TradeOffer> fetchBagRelationships(Page<TradeOffer> tradeOffers) {
        return new PageImpl<>(fetchBagRelationships(tradeOffers.getContent()), tradeOffers.getPageable(), tradeOffers.getTotalElements());
    }

    @Override
    public List<TradeOffer> fetchBagRelationships(List<TradeOffer> tradeOffers) {
        return Optional.of(tradeOffers).map(this::fetchTradeObjects).map(this::fetchTrockeurUsers).orElse(Collections.emptyList());
    }

    TradeOffer fetchTradeObjects(TradeOffer result) {
        return entityManager
            .createQuery(
                "select tradeOffer from TradeOffer tradeOffer left join fetch tradeOffer.tradeObjects where tradeOffer.id = :id",
                TradeOffer.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<TradeOffer> fetchTradeObjects(List<TradeOffer> tradeOffers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tradeOffers.size()).forEach(index -> order.put(tradeOffers.get(index).getId(), index));
        List<TradeOffer> result = entityManager
            .createQuery(
                "select tradeOffer from TradeOffer tradeOffer left join fetch tradeOffer.tradeObjects where tradeOffer in :tradeOffers",
                TradeOffer.class
            )
            .setParameter("tradeOffers", tradeOffers)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    TradeOffer fetchTrockeurUsers(TradeOffer result) {
        return entityManager
            .createQuery(
                "select tradeOffer from TradeOffer tradeOffer left join fetch tradeOffer.trockeurUsers where tradeOffer.id = :id",
                TradeOffer.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<TradeOffer> fetchTrockeurUsers(List<TradeOffer> tradeOffers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tradeOffers.size()).forEach(index -> order.put(tradeOffers.get(index).getId(), index));
        List<TradeOffer> result = entityManager
            .createQuery(
                "select tradeOffer from TradeOffer tradeOffer left join fetch tradeOffer.trockeurUsers where tradeOffer in :tradeOffers",
                TradeOffer.class
            )
            .setParameter("tradeOffers", tradeOffers)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
