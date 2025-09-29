package com.farmchainx.api.retailer.entities;

import com.farmchainx.api.auth.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "retail_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetailSale {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 64)
  private String batchCode;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "retailer_id")
  private User retailer;

  private Double quantityKg;

  private Double totalAmount;

  private Instant createdAt;
}
