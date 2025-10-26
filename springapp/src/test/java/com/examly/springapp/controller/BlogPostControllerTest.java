package com.examly.springapp.controller;

import com.examly.springapp.model.BlogPost;
import com.examly.springapp.repository.BlogPostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class BlogPostControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private BlogPostRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    BlogPost sample;
    
    @BeforeEach
    public void setup() {
        repository.deleteAll();
        sample = new BlogPost();
        sample.setTitle("Test Title");
        sample.setContent("Test Content");
        sample.setAuthor("Test Author");
        repository.save(sample);
    }

    @Test
    void contoller_testGetAllBlogPostsEndpoint() throws Exception {
        mockMvc.perform(get("/api/posts"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void controller_testGetBlogPostByIdEndpoint() throws Exception {
        mockMvc.perform(get("/api/posts/" + sample.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title", is("Test Title")));
    }

    @Test
    void controller_testGetBlogPostByIdNotFoundEndpoint() throws Exception {
        mockMvc.perform(get("/api/posts/999999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message", is("Blog post not found with id: 999999")));
    }

    @Test
    void controller_testCreateBlogPostEndpoint() throws Exception {
        BlogPost toCreate = new BlogPost();
        toCreate.setTitle("Create Test");
        toCreate.setContent("Created content");
        toCreate.setAuthor("Author");
        mockMvc.perform(post("/api/posts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(toCreate)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.title", is("Create Test")));
    }



    @Test
    void controller_testUpdateBlogPostNotFoundEndpoint() throws Exception {
        BlogPost update = new BlogPost();
        update.setTitle("Updated Title");
        update.setContent("Updated Content");
        update.setAuthor("Updated Author");
        mockMvc.perform(put("/api/posts/999999")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(update)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message", is("Blog post not found with id: 999999")));
    }

    @Test
    void controller_testDeleteBlogPostEndpoint() throws Exception {
        mockMvc.perform(delete("/api/posts/" + sample.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message", is("Blog post deleted successfully")));
    }

    @Test
    void controller_testDeleteBlogPostNotFoundEndpoint() throws Exception {
        mockMvc.perform(delete("/api/posts/999999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message", is("Blog post not found with id: 999999")));
    }
}
