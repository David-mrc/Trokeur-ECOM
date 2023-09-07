package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ObjectCategory.
 */
@Entity
@Table(name = "object_category")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ObjectCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "objectCategories")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "genericImages", "objectCategories", "trockeurUser", "tradeOffers" }, allowSetters = true)
    private Set<TradeObject> tradeObjects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ObjectCategory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ObjectCategory name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<TradeObject> getTradeObjects() {
        return this.tradeObjects;
    }

    public void setTradeObjects(Set<TradeObject> tradeObjects) {
        if (this.tradeObjects != null) {
            this.tradeObjects.forEach(i -> i.removeObjectCategory(this));
        }
        if (tradeObjects != null) {
            tradeObjects.forEach(i -> i.addObjectCategory(this));
        }
        this.tradeObjects = tradeObjects;
    }

    public ObjectCategory tradeObjects(Set<TradeObject> tradeObjects) {
        this.setTradeObjects(tradeObjects);
        return this;
    }

    public ObjectCategory addTradeObject(TradeObject tradeObject) {
        this.tradeObjects.add(tradeObject);
        tradeObject.getObjectCategories().add(this);
        return this;
    }

    public ObjectCategory removeTradeObject(TradeObject tradeObject) {
        this.tradeObjects.remove(tradeObject);
        tradeObject.getObjectCategories().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ObjectCategory)) {
            return false;
        }
        return id != null && id.equals(((ObjectCategory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ObjectCategory{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
