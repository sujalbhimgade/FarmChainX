package com.farmchainx.api.distributor.entities;

import com.farmchainx.api.auth.entities.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalesOrder {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="distributor_id", nullable=false)
  private User distributor;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="retailer_id", nullable=false)
  private User retailer;

  private Double totalAmount;

  // PENDING_APPROVAL | CONFIRMED | SHIPPED | CANCELLED
  @Column(length = 24, nullable = false)
  private String status;

  private Instant createdAt;
  private LocalDate deliveryDate;

  @Column(length = 200)
  private String paymentTerms;

  @Column(length = 500)
  private String notes;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<SalesOrderLine> lines = new ArrayList<>();
}
