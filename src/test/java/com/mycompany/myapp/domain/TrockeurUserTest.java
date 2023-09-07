package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TrockeurUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TrockeurUser.class);
        TrockeurUser trockeurUser1 = new TrockeurUser();
        trockeurUser1.setId(1L);
        TrockeurUser trockeurUser2 = new TrockeurUser();
        trockeurUser2.setId(trockeurUser1.getId());
        assertThat(trockeurUser1).isEqualTo(trockeurUser2);
        trockeurUser2.setId(2L);
        assertThat(trockeurUser1).isNotEqualTo(trockeurUser2);
        trockeurUser1.setId(null);
        assertThat(trockeurUser1).isNotEqualTo(trockeurUser2);
    }
}
