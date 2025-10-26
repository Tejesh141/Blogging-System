package com.examly.springapp.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;

import java.util.Set;

class BlogPostTest {
    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private final Validator validator = factory.getValidator();

    @Test
    void entity_testBlogPostEntityCreation() {
        BlogPost post = new BlogPost();
        post.setTitle("Test");
        post.setContent("Some content");
        post.setAuthor("Author");
        assertEquals("Test", post.getTitle());
        assertEquals("Some content", post.getContent());
        assertEquals("Author", post.getAuthor());
        // createdAt/updatedAt set via lifecycle; test null before persist
        assertNull(post.getCreatedAt());
        assertNull(post.getUpdatedAt());
    }
    
    @Test
    void entity_testValidationConstraints() {
        BlogPost post = new BlogPost();
        Set<ConstraintViolation<BlogPost>> violations = validator.validate(post);
        assertFalse(violations.isEmpty());
    }
}
