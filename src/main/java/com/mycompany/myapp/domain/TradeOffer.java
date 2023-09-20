package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.TradeOfferState;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TradeOffer.
 */
@Entity
@Table(name = "trade_offer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TradeOffer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private TradeOfferState state;

    //  TrockeurUser id of the creator of the offer
    @Column(name = "owner_id")
    private Long ownerID;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_trade_offer__trade_object",
        joinColumns = @JoinColumn(name = "trade_offer_id"),
        inverseJoinColumns = @JoinColumn(name = "trade_object_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "genericImages", "objectCategories", "trockeurUser", "tradeOffers" }, allowSetters = true)
    private Set<TradeObject> tradeObjects = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_trade_offer__trockeur_user",
        joinColumns = @JoinColumn(name = "trade_offer_id"),
        inverseJoinColumns = @JoinColumn(name = "trockeur_user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "tradeObjects", "tradeOffers" }, allowSetters = true)
    private Set<TrockeurUser> trockeurUsers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TradeOffer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public TradeOffer date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TradeOfferState getState() {
        return this.state;
    }

    public TradeOffer state(TradeOfferState state) {
        this.setState(state);
        return this;
    }

    public void setState(TradeOfferState state) {
        this.state = state;
    }

    public Long getOwnerID() {
        return this.ownerID;
    }

    public TradeOffer ownerID(Long ownerID) {
        this.setOwnerID(ownerID);
        return this;
    }

    public void setOwnerID(Long ownerID) {
        this.ownerID = ownerID;
    }

    public Set<TradeObject> getTradeObjects() {
        return this.tradeObjects;
    }

    public void setTradeObjects(Set<TradeObject> tradeObjects) {
        this.tradeObjects = tradeObjects;
    }

    public TradeOffer tradeObjects(Set<TradeObject> tradeObjects) {
        this.setTradeObjects(tradeObjects);
        return this;
    }

    public TradeOffer addTradeObject(TradeObject tradeObject) {
        this.tradeObjects.add(tradeObject);
        tradeObject.getTradeOffers().add(this);
        return this;
    }

    public TradeOffer removeTradeObject(TradeObject tradeObject) {
        this.tradeObjects.remove(tradeObject);
        tradeObject.getTradeOffers().remove(this);
        return this;
    }

    public Set<TrockeurUser> getTrockeurUsers() {
        return this.trockeurUsers;
    }

    public void setTrockeurUsers(Set<TrockeurUser> trockeurUsers) {
        this.trockeurUsers = trockeurUsers;
    }

    public TradeOffer trockeurUsers(Set<TrockeurUser> trockeurUsers) {
        this.setTrockeurUsers(trockeurUsers);
        return this;
    }

    public TradeOffer addTrockeurUser(TrockeurUser trockeurUser) {
        this.trockeurUsers.add(trockeurUser);
        trockeurUser.getTradeOffers().add(this);
        return this;
    }

    public TradeOffer removeTrockeurUser(TrockeurUser trockeurUser) {
        this.trockeurUsers.remove(trockeurUser);
        trockeurUser.getTradeOffers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TradeOffer)) {
            return false;
        }
        return id != null && id.equals(((TradeOffer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TradeOffer{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", state='" + getState() + "'" +
            ", ownerID=" + getOwnerID() +
            "}";
    }
}
