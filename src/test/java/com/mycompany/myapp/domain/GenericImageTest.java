package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GenericImageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GenericImage.class);
        GenericImage genericImage1 = new GenericImage();
        genericImage1.setId(1L);
        GenericImage genericImage2 = new GenericImage();
        genericImage2.setId(genericImage1.getId());
        assertThat(genericImage1).isEqualTo(genericImage2);
        genericImage2.setId(2L);
        assertThat(genericImage1).isNotEqualTo(genericImage2);
        genericImage1.setId(null);
        assertThat(genericImage1).isNotEqualTo(genericImage2);
    }
}
