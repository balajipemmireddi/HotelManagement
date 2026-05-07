package com.Hotel.specification;

import org.springframework.data.jpa.domain.Specification;

import com.Hotel.entity.Hotel;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

/**
 * PHASE 9 — Hotel Specification for advanced filtering.
 *
 * Uses JPA Criteria API for dynamic query building.
 */
public class HotelSpecification {

    public static Specification<Hotel> withFilters(
            String city,
            Integer minStarRating,
            Integer maxStarRating,
            Double minPrice,
            Double maxPrice,
            String name) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter active hotels
            predicates.add(criteriaBuilder.isTrue(root.get("isActive")));

            // City filter (case-insensitive)
            if (city != null && !city.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("city")),
                        "%" + city.toLowerCase() + "%"
                ));
            }

            // Star rating range
            if (minStarRating != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("starRating"), minStarRating
                ));
            }
            if (maxStarRating != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("starRating"), maxStarRating
                ));
            }

            // Name search (partial match, case-insensitive)
            if (name != null && !name.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + name.toLowerCase() + "%"
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
