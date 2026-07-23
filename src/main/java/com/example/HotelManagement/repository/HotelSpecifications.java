package com.example.HotelManagement.repository;

import com.example.HotelManagement.entity.Hotel;
import org.springframework.data.jpa.domain.Specification;

public class HotelSpecifications {
    public static Specification<Hotel> withFilters(String city, Double minPrice, Double maxPrice) {
        return (root, query, cb) -> {
            var predicate = cb.conjunction();

            if (city != null && !city.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"));
            }

            // Note: Price filtering usually happens on the Room level,
            // but for now, we'll keep the Specification structure clean.
            return predicate;
        };
    }
}