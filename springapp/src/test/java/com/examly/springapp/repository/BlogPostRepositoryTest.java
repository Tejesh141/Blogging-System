package com.examly.springapp.repository;

import com.examly.springapp.model.BlogPost;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class BlogPostRepositoryTest {
    @Autowired
    private BlogPostRepository repository;

    @Test
    void repository_testBlogPostRepositorySave() {
        BlogPost post = new BlogPost();
        post.setTitle("Title");
        post.setContent("Content");
        post.setAuthor("Author");
        BlogPost saved = repository.save(post);
        assertNotNull(saved.getId());
        assertEquals("Title", saved.getTitle());
    }
    
    @Test
    void repository_testBlogPostRepositoryFindById() {
        BlogPost post = new BlogPost();
        post.setTitle("FindId");
        post.setContent("Content");
        post.setAuthor("Author");
        BlogPost saved = repository.save(post);
        Optional<BlogPost> found = repository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("FindId", found.get().getTitle());
    }
    
    @Test
    void repository_testBlogPostRepositoryFindAll() {
        BlogPost post1 = new BlogPost();
        post1.setTitle("Title1");
        post1.setContent("Content1");
        post1.setAuthor("Author1");
        repository.save(post1);
        BlogPost post2 = new BlogPost();
        post2.setTitle("Title2");
        post2.setContent("Content2");
        post2.setAuthor("Author2");
        repository.save(post2);
        List<BlogPost> all = repository.findAll();
        assertTrue(all.size() >= 2);
    }

    @Test
    void repository_testBlogPostRepositoryDelete() {
        BlogPost post = new BlogPost();
        post.setTitle("Del");
        post.setContent("Content");
        post.setAuthor("Author");
        BlogPost saved = repository.save(post);
        repository.deleteById(saved.getId());
        assertTrue(repository.findById(saved.getId()).isEmpty());
    }
}
