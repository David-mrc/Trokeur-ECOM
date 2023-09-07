package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeOffer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface TradeOfferRepositoryWithBagRelationships {
    Optional<TradeOffer> fetchBagRelationships(Optional<TradeOffer> tradeOffer);

    List<TradeOffer> fetchBagRelationships(List<TradeOffer> tradeOffers);

    Page<TradeOffer> fetchBagRelationships(Page<TradeOffer> tradeOffers);
}
