package com.Hotel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.Hotel.entity.Hotel;

/**
 * JpaSpecificationExecutor is added now so Phase 9 (advanced search)
 * can plug in Specification-based filtering without touching this file.
 */
@Repository
public interface HotelRepo extends JpaRepository<Hotel, Long>, JpaSpecificationExecutor<Hotel> {

    // Only return active hotels for public listing
    List<Hotel> findAllByIsActiveTrue();

    // Find active hotel by id — used in detail view
    Optional<Hotel> findByIdAndIsActiveTrue(Long id);

    // City-based search — used in basic search (Phase 9 will extend this)
    List<Hotel> findByCityIgnoreCaseAndIsActiveTrue(String city);
}
