package com.umerqureshicodes.backend.repositories;

import com.umerqureshicodes.backend.entities.Rating;
import com.umerqureshicodes.backend.entities.RatingId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, RatingId> {
}
