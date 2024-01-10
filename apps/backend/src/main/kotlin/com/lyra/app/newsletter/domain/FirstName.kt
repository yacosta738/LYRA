package com.lyra.app.newsletter.domain

import com.lyra.app.newsletter.domain.exceptions.FirstNameNotValidException
import com.lyra.common.domain.BaseValidateValueObject

private const val NAME_LEN = 150

/**
 * Email value object
 * @param firstname first name value
 * @throws FirstNameNotValidException if first name is not valid
 * @see BaseValidateValueObject
 * @see BaseValueObject
 * @see FirstNameNotValidException
 */
data class FirstName(val firstname: String) : BaseValidateValueObject<String>(firstname) {
    /**
     * Validate first name value object with regex
     * @param value first name value
     * @throws FirstNameNotValidException if first name is not valid
     */
    override fun validate(value: String) {
        val firstname = value.trim()
        if (firstname.isEmpty() || firstname.length > NAME_LEN || containsInvalidCharacters(
                firstname,
            )
        ) {
            throw FirstNameNotValidException(value)
        }
    }

    private fun containsInvalidCharacters(firstname: String): Boolean =
        !firstname.matches(Regex("^[a-zA-ZÀ-ÿ\\s]{1,150}\$"))

    override fun toString(): String = firstname
}
