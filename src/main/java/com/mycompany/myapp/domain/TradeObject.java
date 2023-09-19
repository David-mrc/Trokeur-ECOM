package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.TradeObjectState;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TradeObject.
 */
@Entity
@Table(name = "trade_object")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TradeObject implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 5)
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private TradeObjectState state;

    @NotNull
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "tradeObject", cascade = CascadeType.REMOVE)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tradeObject" }, allowSetters = true)
    private Set<GenericImage> genericImages = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_trade_object__object_category",
        joinColumns = @JoinColumn(name = "trade_object_id"),
        inverseJoinColumns = @JoinColumn(name = "object_category_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tradeObjects" }, allowSetters = true)
    private Set<ObjectCategory> objectCategories = new HashSet<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "user", "tradeObjects", "tradeOffers" }, allowSetters = true)
    private TrockeurUser trockeurUser;

    @ManyToMany(fetch = FetchType.EAGER, mappedBy = "tradeObjects")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tradeObjects", "trockeurUsers" }, allowSetters = true)
    private Set<TradeOffer> tradeOffers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TradeObject id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public TradeObject name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public TradeObject description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TradeObjectState getState() {
        return this.state;
    }

    public TradeObject state(TradeObjectState state) {
        this.setState(state);
        return this;
    }

    public void setState(TradeObjectState state) {
        this.state = state;
    }

    public Integer getStock() {
        return this.stock;
    }

    public TradeObject stock(Integer stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Set<GenericImage> getGenericImages() {
        return this.genericImages;
    }

    public void setGenericImages(Set<GenericImage> genericImages) {
        if (this.genericImages != null) {
            this.genericImages.forEach(i -> i.setTradeObject(null));
        }
        if (genericImages != null) {
            genericImages.forEach(i -> i.setTradeObject(this));
        }
        this.genericImages = genericImages;
    }

    public TradeObject genericImages(Set<GenericImage> genericImages) {
        this.setGenericImages(genericImages);
        return this;
    }

    public TradeObject addGenericImage(GenericImage genericImage) {
        this.genericImages.add(genericImage);
        genericImage.setTradeObject(this);
        return this;
    }

    public TradeObject removeGenericImage(GenericImage genericImage) {
        this.genericImages.remove(genericImage);
        genericImage.setTradeObject(null);
        return this;
    }

    public Set<ObjectCategory> getObjectCategories() {
        return this.objectCategories;
    }

    public void setObjectCategories(Set<ObjectCategory> objectCategories) {
        this.objectCategories = objectCategories;
    }

    public TradeObject objectCategories(Set<ObjectCategory> objectCategories) {
        this.setObjectCategories(objectCategories);
        return this;
    }

    public TradeObject addObjectCategory(ObjectCategory objectCategory) {
        this.objectCategories.add(objectCategory);
        objectCategory.getTradeObjects().add(this);
        return this;
    }

    public TradeObject removeObjectCategory(ObjectCategory objectCategory) {
        this.objectCategories.remove(objectCategory);
        objectCategory.getTradeObjects().remove(this);
        return this;
    }

    public TrockeurUser getTrockeurUser() {
        return this.trockeurUser;
    }

    public void setTrockeurUser(TrockeurUser trockeurUser) {
        this.trockeurUser = trockeurUser;
    }

    public TradeObject trockeurUser(TrockeurUser trockeurUser) {
        this.setTrockeurUser(trockeurUser);
        return this;
    }

    public Set<TradeOffer> getTradeOffers() {
        return this.tradeOffers;
    }

    public void setTradeOffers(Set<TradeOffer> tradeOffers) {
        if (this.tradeOffers != null) {
            this.tradeOffers.forEach(i -> i.removeTradeObject(this));
        }
        if (tradeOffers != null) {
            tradeOffers.forEach(i -> i.addTradeObject(this));
        }
        this.tradeOffers = tradeOffers;
    }

    public TradeObject tradeOffers(Set<TradeOffer> tradeOffers) {
        this.setTradeOffers(tradeOffers);
        return this;
    }

    public TradeObject addTradeOffer(TradeOffer tradeOffer) {
        this.tradeOffers.add(tradeOffer);
        tradeOffer.getTradeObjects().add(this);
        return this;
    }

    public TradeObject removeTradeOffer(TradeOffer tradeOffer) {
        this.tradeOffers.remove(tradeOffer);
        tradeOffer.getTradeObjects().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TradeObject)) {
            return false;
        }
        return id != null && id.equals(((TradeObject) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TradeObject{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", state='" + getState() + "'" +
            ", stock=" + getStock() +
            "}";
    }
}
