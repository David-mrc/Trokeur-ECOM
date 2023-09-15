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
 * A TrockeurUser.
 */
@Entity
@Table(name = "trockeur_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TrockeurUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Size(min = 5)
    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "profile_picture_path")
    private String profilePicturePath;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "trockeurUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "genericImages", "objectCategories", "trockeurUser", "tradeOffers" }, allowSetters = true)
    private Set<TradeObject> tradeObjects = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "trockeurUsers")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tradeObjects", "trockeurUsers" }, allowSetters = true)
    private Set<TradeOffer> tradeOffers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TrockeurUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return this.address;
    }

    public TrockeurUser address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZipCode() {
        return this.zipCode;
    }

    public TrockeurUser zipCode(String zipCode) {
        this.setZipCode(zipCode);
        return this;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getDescription() {
        return this.description;
    }

    public TrockeurUser description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProfilePicturePath() {
        return this.profilePicturePath;
    }

    public TrockeurUser profilePicturePath(String profilePicturePath) {
        this.setProfilePicturePath(profilePicturePath);
        return this;
    }

    public void setProfilePicturePath(String profilePicturePath) {
        this.profilePicturePath = profilePicturePath;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TrockeurUser user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<TradeObject> getTradeObjects() {
        return this.tradeObjects;
    }

    public void setTradeObjects(Set<TradeObject> tradeObjects) {
        if (this.tradeObjects != null) {
            this.tradeObjects.forEach(i -> i.setTrockeurUser(null));
        }
        if (tradeObjects != null) {
            tradeObjects.forEach(i -> i.setTrockeurUser(this));
        }
        this.tradeObjects = tradeObjects;
    }

    public TrockeurUser tradeObjects(Set<TradeObject> tradeObjects) {
        this.setTradeObjects(tradeObjects);
        return this;
    }

    public TrockeurUser addTradeObject(TradeObject tradeObject) {
        this.tradeObjects.add(tradeObject);
        tradeObject.setTrockeurUser(this);
        return this;
    }

    public TrockeurUser removeTradeObject(TradeObject tradeObject) {
        this.tradeObjects.remove(tradeObject);
        tradeObject.setTrockeurUser(null);
        return this;
    }

    public Set<TradeOffer> getTradeOffers() {
        return this.tradeOffers;
    }

    public void setTradeOffers(Set<TradeOffer> tradeOffers) {
        if (this.tradeOffers != null) {
            this.tradeOffers.forEach(i -> i.removeTrockeurUser(this));
        }
        if (tradeOffers != null) {
            tradeOffers.forEach(i -> i.addTrockeurUser(this));
        }
        this.tradeOffers = tradeOffers;
    }

    public TrockeurUser tradeOffers(Set<TradeOffer> tradeOffers) {
        this.setTradeOffers(tradeOffers);
        return this;
    }

    public TrockeurUser addTradeOffer(TradeOffer tradeOffer) {
        this.tradeOffers.add(tradeOffer);
        tradeOffer.getTrockeurUsers().add(this);
        return this;
    }

    public TrockeurUser removeTradeOffer(TradeOffer tradeOffer) {
        this.tradeOffers.remove(tradeOffer);
        tradeOffer.getTrockeurUsers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TrockeurUser)) {
            return false;
        }
        return id != null && id.equals(((TrockeurUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TrockeurUser{" +
            "id=" + getId() +
            ", address='" + getAddress() + "'" +
            ", zipCode='" + getZipCode() + "'" +
            ", description='" + getDescription() + "'" +
            ", profilePicturePath='" + getProfilePicturePath() + "'" +
            "}";
    }
}
