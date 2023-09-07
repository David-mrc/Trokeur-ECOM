package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TradeObject;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface TradeObjectRepositoryWithBagRelationships {
    Optional<TradeObject> fetchBagRelationships(Optional<TradeObject> tradeObject);

    List<TradeObject> fetchBagRelationships(List<TradeObject> tradeObjects);

    Page<TradeObject> fetchBagRelationships(Page<TradeObject> tradeObjects);
}
