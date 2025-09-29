package com.farmchainx.api.distributor.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sales_order_lines")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalesOrderLine {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "order_id", nullable = false)
  private SalesOrder order;

  @Column(length = 64, nullable = false)
  private String batchCode;

  @Column(length = 120, nullable = false)
  private String productName;

  private Double quantityKg;
  private Double pricePerKg;
  private Double lineTotal;
}
