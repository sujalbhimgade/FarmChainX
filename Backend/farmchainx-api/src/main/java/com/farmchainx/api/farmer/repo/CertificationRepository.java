/*
 * // CertificationRepository.java package com.farmchainx.api.farmer.repo;
 * import com.farmchainx.api.farmer.entities.Certification; import
 * org.springframework.data.jpa.repository.JpaRepository; import
 * java.util.Optional;
 * 
 * public interface CertificationRepository extends JpaRepository<Certification,
 * Long> { Optional<Certification>
 * findTopByCropPublicIdOrderByIssuedAtDesc(String publicId); }
 */