package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeObject;
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
public class TradeObjectRepositoryWithBagRelationshipsImpl implements TradeObjectRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<TradeObject> fetchBagRelationships(Optional<TradeObject> tradeObject) {
        return tradeObject.map(this::fetchObjectCategories);
    }

    @Override
    public Page<TradeObject> fetchBagRelationships(Page<TradeObject> tradeObjects) {
        return new PageImpl<>(
            fetchBagRelationships(tradeObjects.getContent()),
            tradeObjects.getPageable(),
            tradeObjects.getTotalElements()
        );
    }

    @Override
    public List<TradeObject> fetchBagRelationships(List<TradeObject> tradeObjects) {
        return Optional.of(tradeObjects).map(this::fetchObjectCategories).orElse(Collections.emptyList());
    }

    TradeObject fetchObjectCategories(TradeObject result) {
        return entityManager
            .createQuery(
                "select tradeObject from TradeObject tradeObject left join fetch tradeObject.objectCategories where tradeObject.id = :id",
                TradeObject.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<TradeObject> fetchObjectCategories(List<TradeObject> tradeObjects) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tradeObjects.size()).forEach(index -> order.put(tradeObjects.get(index).getId(), index));
        List<TradeObject> result = entityManager
            .createQuery(
                "select tradeObject from TradeObject tradeObject left join fetch tradeObject.objectCategories where tradeObject in :tradeObjects",
                TradeObject.class
            )
            .setParameter("tradeObjects", tradeObjects)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
