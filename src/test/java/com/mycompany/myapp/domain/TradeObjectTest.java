package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TradeObjectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TradeObject.class);
        TradeObject tradeObject1 = new TradeObject();
        tradeObject1.setId(1L);
        TradeObject tradeObject2 = new TradeObject();
        tradeObject2.setId(tradeObject1.getId());
        assertThat(tradeObject1).isEqualTo(tradeObject2);
        tradeObject2.setId(2L);
        assertThat(tradeObject1).isNotEqualTo(tradeObject2);
        tradeObject1.setId(null);
        assertThat(tradeObject1).isNotEqualTo(tradeObject2);
    }
}
