package com.farmchainx.api.distributor.entities;

import com.farmchainx.api.auth.entities.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="retailer_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetailerProfile {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="distributor_id", nullable=false)
  private User distributor;

  // Optional link if the retailer also signs into the app
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="retailer_user_id")
  private User retailerUser;

  @Column(length = 120, nullable = false)
  private String name;

  @Column(length = 120)
  private String contact;

  @Column(length = 30)
  private String phone;

  @Column(length = 160)
  private String email;

  @Column(length = 160)
  private String location;

  private Double creditLimit;
  private Double outstandingAmount;
  private Double rating;

  @Column(length = 300)
  private String preferredProducts;

  @Column(length = 500)
  private String notes;
}
