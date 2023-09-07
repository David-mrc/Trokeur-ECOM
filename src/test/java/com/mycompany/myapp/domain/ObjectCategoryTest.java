package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ObjectCategoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ObjectCategory.class);
        ObjectCategory objectCategory1 = new ObjectCategory();
        objectCategory1.setId(1L);
        ObjectCategory objectCategory2 = new ObjectCategory();
        objectCategory2.setId(objectCategory1.getId());
        assertThat(objectCategory1).isEqualTo(objectCategory2);
        objectCategory2.setId(2L);
        assertThat(objectCategory1).isNotEqualTo(objectCategory2);
        objectCategory1.setId(null);
        assertThat(objectCategory1).isNotEqualTo(objectCategory2);
    }
}
