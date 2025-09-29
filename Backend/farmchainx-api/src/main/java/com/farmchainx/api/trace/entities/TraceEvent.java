package com.farmchainx.api.trace.entities;

import com.farmchainx.api.auth.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "trace_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TraceEvent {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 64)
  private String batchCode;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private SupplyStage stage;

  @Column(length = 160)
  private String location;

  @Column(length = 500)
  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "actor_id")
  private User actor;

  @Column(nullable = false)
  private Instant createdAt;
}
