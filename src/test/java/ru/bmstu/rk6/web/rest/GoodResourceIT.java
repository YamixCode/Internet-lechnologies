package ru.bmstu.rk6.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import ru.bmstu.rk6.IntegrationTest;
import ru.bmstu.rk6.domain.Good;
import ru.bmstu.rk6.repository.EntityManager;
import ru.bmstu.rk6.repository.GoodRepository;

/**
 * Integration tests for the {@link GoodResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class GoodResourceIT {

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/goods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GoodRepository goodRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Good good;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Good createEntity(EntityManager em) {
        Good good = new Good().amount(DEFAULT_AMOUNT).name(DEFAULT_NAME);
        return good;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Good createUpdatedEntity(EntityManager em) {
        Good good = new Good().amount(UPDATED_AMOUNT).name(UPDATED_NAME);
        return good;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Good.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        good = createEntity(em);
    }

    @Test
    void createGood() throws Exception {
        int databaseSizeBeforeCreate = goodRepository.findAll().collectList().block().size();
        // Create the Good
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeCreate + 1);
        Good testGood = goodList.get(goodList.size() - 1);
        assertThat(testGood.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testGood.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createGoodWithExistingId() throws Exception {
        // Create the Good with an existing ID
        good.setId(1L);

        int databaseSizeBeforeCreate = goodRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllGoodsAsStream() {
        // Initialize the database
        goodRepository.save(good).block();

        List<Good> goodList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Good.class)
            .getResponseBody()
            .filter(good::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(goodList).isNotNull();
        assertThat(goodList).hasSize(1);
        Good testGood = goodList.get(0);
        assertThat(testGood.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testGood.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void getAllGoods() {
        // Initialize the database
        goodRepository.save(good).block();

        // Get all the goodList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(good.getId().intValue()))
            .jsonPath("$.[*].amount")
            .value(hasItem(DEFAULT_AMOUNT))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getGood() {
        // Initialize the database
        goodRepository.save(good).block();

        // Get the good
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, good.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(good.getId().intValue()))
            .jsonPath("$.amount")
            .value(is(DEFAULT_AMOUNT))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingGood() {
        // Get the good
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingGood() throws Exception {
        // Initialize the database
        goodRepository.save(good).block();

        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();

        // Update the good
        Good updatedGood = goodRepository.findById(good.getId()).block();
        updatedGood.amount(UPDATED_AMOUNT).name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedGood.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedGood))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
        Good testGood = goodList.get(goodList.size() - 1);
        assertThat(testGood.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testGood.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingGood() throws Exception {
        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();
        good.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, good.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchGood() throws Exception {
        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();
        good.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamGood() throws Exception {
        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();
        good.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateGoodWithPatch() throws Exception {
        // Initialize the database
        goodRepository.save(good).block();

        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();

        // Update the good using partial update
        Good partialUpdatedGood = new Good();
        partialUpdatedGood.setId(good.getId());

        partialUpdatedGood.amount(UPDATED_AMOUNT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGood.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedGood))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
        Good testGood = goodList.get(goodList.size() - 1);
        assertThat(testGood.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testGood.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void fullUpdateGoodWithPatch() throws Exception {
        // Initialize the database
        goodRepository.save(good).block();

        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();

        // Update the good using partial update
        Good partialUpdatedGood = new Good();
        partialUpdatedGood.setId(good.getId());

        partialUpdatedGood.amount(UPDATED_AMOUNT).name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedGood.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedGood))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
        Good testGood = goodList.get(goodList.size() - 1);
        assertThat(testGood.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testGood.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingGood() throws Exception {
        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();
        good.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, good.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchGood() throws Exception {
        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();
        good.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamGood() throws Exception {
        int databaseSizeBeforeUpdate = goodRepository.findAll().collectList().block().size();
        good.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(good))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Good in the database
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteGood() {
        // Initialize the database
        goodRepository.save(good).block();

        int databaseSizeBeforeDelete = goodRepository.findAll().collectList().block().size();

        // Delete the good
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, good.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Good> goodList = goodRepository.findAll().collectList().block();
        assertThat(goodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
