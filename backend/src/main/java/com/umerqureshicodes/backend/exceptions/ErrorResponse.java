package com.umerqureshicodes.backend.exceptions;

public record ErrorResponse(
        int status,
        String message
) {
}
