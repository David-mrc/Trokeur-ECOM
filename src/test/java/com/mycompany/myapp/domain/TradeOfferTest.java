package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TradeOfferTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TradeOffer.class);
        TradeOffer tradeOffer1 = new TradeOffer();
        tradeOffer1.setId(1L);
        TradeOffer tradeOffer2 = new TradeOffer();
        tradeOffer2.setId(tradeOffer1.getId());
        assertThat(tradeOffer1).isEqualTo(tradeOffer2);
        tradeOffer2.setId(2L);
        assertThat(tradeOffer1).isNotEqualTo(tradeOffer2);
        tradeOffer1.setId(null);
        assertThat(tradeOffer1).isNotEqualTo(tradeOffer2);
    }
}
