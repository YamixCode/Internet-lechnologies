package ru.bmstu.rk6.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import ru.bmstu.rk6.web.rest.TestUtil;

class GoodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Good.class);
        Good good1 = new Good();
        good1.setId(1L);
        Good good2 = new Good();
        good2.setId(good1.getId());
        assertThat(good1).isEqualTo(good2);
        good2.setId(2L);
        assertThat(good1).isNotEqualTo(good2);
        good1.setId(null);
        assertThat(good1).isNotEqualTo(good2);
    }
}
