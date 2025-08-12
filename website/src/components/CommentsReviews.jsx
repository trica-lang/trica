import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Send, User, Calendar, Zap, Brain, Sparkles, Database, Wifi, Crown, LogIn } from 'lucide-react';
import { supabase, getUserIP, formatDate } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './CommentsReviews.css';

const CommentsReviews = () => {
  const { user, isVerifiedUser, isPremiumUser, getUserDisplayName } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    title: '',
    comment: '',
    mindDestroyed: true
  });
  const [filter, setFilter] = useState('all'); // all, 5star, 4star, etc.
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, rating
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [userIP, setUserIP] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // No fake reviews - only real human reviews from Supabase
  const initialReviews = [];

  // Load reviews from Supabase on component mount
  useEffect(() => {
    fetchReviews();
    initializeUserIP();
    setupRealtimeSubscription();
    
    return () => {
      // Cleanup subscription on unmount
      supabase.removeAllChannels();
    };
  }, []);

  const initializeUserIP = async () => {
    try {
      const ip = await getUserIP();
      setUserIP(ip);
    } catch (error) {
      console.error('Error getting user IP:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setReviews(data || []);
      setIsOnline(true);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setIsOnline(false);
      
      // Fallback to localStorage
      const savedReviews = localStorage.getItem('trica-reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        setReviews(initialReviews);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to new reviews
    const reviewsSubscription = supabase
      .channel('reviews_channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reviews' },
        (payload) => {
          console.log('New review added:', payload.new);
          setReviews(prev => [payload.new, ...prev]);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reviews' },
        (payload) => {
          console.log('Review updated:', payload.new);
          setReviews(prev => prev.map(review => 
            review.id === payload.new.id ? payload.new : review
          ));
        }
      )
      .subscribe();

    return reviewsSubscription;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.title.trim() || !newReview.comment.trim()) {
      alert('Please fill in all fields!');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          name: newReview.name.trim(),
          rating: newReview.rating,
          title: newReview.title.trim(),
          comment: newReview.comment.trim(),
          mind_destroyed: newReview.mindDestroyed
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Reset form on success
      setNewReview({
        name: '',
        rating: 5,
        title: '',
        comment: '',
        mindDestroyed: true
      });

      // Show success message
      alert('🧠💥 Review submitted! Your mind destruction experience has been recorded!');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      
      // Fallback to localStorage
      const review = {
        id: Date.now(),
        name: newReview.name.trim(),
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        mind_destroyed: newReview.mindDestroyed,
        created_at: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        verified: false
      };

      setReviews(prev => [review, ...prev]);
      localStorage.setItem('trica-reviews', JSON.stringify([review, ...reviews]));
      
      alert('Review saved locally! (Database connection unavailable)');
      
      setNewReview({
        name: '',
        rating: 5,
        title: '',
        comment: '',
        mindDestroyed: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (reviewId) => {
    if (!userIP) {
      alert('Please wait while we initialize your session...');
      return;
    }

    try {
      const { error } = await supabase
        .from('review_likes')
        .upsert([{
          review_id: reviewId,
          user_ip: userIP,
          is_like: true
        }], {
          onConflict: 'review_id,user_ip'
        });

      if (error) throw error;
      
      // The trigger will automatically update the review likes count
      // and the realtime subscription will update our local state
      
    } catch (error) {
      console.error('Error liking review:', error);
      
      // Fallback to local state update
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, likes: (review.likes || 0) + 1 }
          : review
      ));
    }
  };

  const handleDislike = async (reviewId) => {
    if (!userIP) {
      alert('Please wait while we initialize your session...');
      return;
    }

    try {
      const { error } = await supabase
        .from('review_likes')
        .upsert([{
          review_id: reviewId,
          user_ip: userIP,
          is_like: false
        }], {
          onConflict: 'review_id,user_ip'
        });

      if (error) throw error;
      
      // The trigger will automatically update the review dislikes count
      // and the realtime subscription will update our local state
      
    } catch (error) {
      console.error('Error disliking review:', error);
      
      // Fallback to local state update
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, dislikes: (review.dislikes || 0) + 1 }
          : review
      ));
    }
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Apply filter
    if (filter !== 'all') {
      const rating = parseInt(filter.replace('star', ''));
      filtered = reviews.filter(review => review.rating === rating);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'rating':
          return b.rating - a.rating;
        case 'likes':
          return b.likes - a.likes;
        default: // newest
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <section id="reviews" className="comments-reviews">
      <div className="container">
        <div className="reviews-header">
          <div className="section-badge">
            <MessageCircle size={16} />
            <span>Reviews & Comments</span>
          </div>
          
          <h2 className="section-title">
            What Developers Say About <span className="text-gradient">Trica</span>
          </h2>
          
          <p className="section-description">
            <strong>100% AUTHENTIC REVIEWS</strong> from real developers whose minds have been 
            <strong> physically destroyed</strong> by Trica's infinite complexity. No fake reviews!
          </p>
        </div>

        <div className="reviews-overview">
          <div className="rating-summary">
            <div className="average-rating">
              <span className="rating-number">{getAverageRating()}</span>
              {renderStars(Math.round(getAverageRating()))}
              <span className="total-reviews">({totalReviews} reviews)</span>
            </div>
            
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating}</span>
                  <Star size={12} className="star filled" />
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${totalReviews > 0 ? (distribution[rating] / totalReviews) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="rating-count">({distribution[rating]})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mind-destruction-stats">
            <div className="stat-card">
              <Brain className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">100%</span>
                <span className="stat-label">Minds Destroyed</span>
              </div>
            </div>
            <div className="stat-card">
              <Zap className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">&lt;1μs</span>
                <span className="stat-label">Avg Execution</span>
              </div>
            </div>
            <div className="stat-card">
              <Sparkles className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">∞</span>
                <span className="stat-label">Complexity Level</span>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-content">
          <div className="reviews-controls">
            <div className="filter-controls">
              <label>Filter by rating:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Reviews</option>
                <option value="5star">5 Stars</option>
                <option value="4star">4 Stars</option>
                <option value="3star">3 Stars</option>
                <option value="2star">2 Stars</option>
                <option value="1star">1 Star</option>
              </select>
            </div>
            
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rating</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>

          <div className="reviews-grid">
            <div className="reviews-list">
              {getFilteredAndSortedReviews().map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        <User size={20} />
                      </div>
                      <div className="reviewer-details">
                        <span className="reviewer-name">
                          {review.name}
                          {review.verified && <span className="verified-badge">✓</span>}
                        </span>
                        <div className="review-meta">
                          {renderStars(review.rating)}
                          <span className="review-date">
                            <Calendar size={12} />
                            {formatDate(review.created_at || review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {review.mindDestroyed && (
                      <div className="mind-destroyed-badge">
                        <Brain size={16} />
                        Mind Destroyed
                      </div>
                    )}
                  </div>
                  
                  <div className="review-content">
                    <h4 className="review-title">{review.title}</h4>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                  
                  <div className="review-actions">
                    <button 
                      className="action-btn like-btn"
                      onClick={() => handleLike(review.id)}
                    >
                      <ThumbsUp size={14} />
                      {review.likes}
                    </button>
                    <button 
                      className="action-btn dislike-btn"
                      onClick={() => handleDislike(review.id)}
                    >
                      <ThumbsDown size={14} />
                      {review.dislikes}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="review-form-container">
              <div className="review-form-card">
                <h3>Share Your Mind Destruction Experience</h3>
                <p>Tell us how Trica destroyed your understanding of programming!</p>
                
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      {renderStars(newReview.rating, true, (rating) => 
                        setNewReview(prev => ({ ...prev, rating }))
                      )}
                      <span className="rating-text">({newReview.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Review Title</label>
                    <input
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Describe how Trica destroyed your mind..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newReview.mindDestroyed}
                        onChange={(e) => setNewReview(prev => ({ ...prev, mindDestroyed: e.target.checked }))}
                      />
                      <span className="checkmark"></span>
                      My mind has been physically destroyed by Trica
                    </label>
                  </div>
                  
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="supabase-info">
          <div className="info-card">
            <div className="connection-status">
              <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? <Database size={16} /> : <Wifi size={16} />}
                <span>{isOnline ? 'Connected to Supabase' : 'Offline Mode'}</span>
              </div>
            </div>
            
            <h4>🚀 {isOnline ? 'Real-Time Database Active!' : 'Database Integration Available'}</h4>
            <p>
              {isOnline ? (
                <>
                  Reviews are stored in <strong>Supabase PostgreSQL</strong> with real-time updates! 
                  New reviews appear instantly across all users. Features include user tracking, 
                  like/dislike persistence, and automatic spam protection.
                </>
              ) : (
                <>
                  Currently using localStorage fallback. Connect to the internet to enable 
                  <strong> Supabase</strong> real-time reviews, user authentication, 
                  and advanced features like comment threading and moderation!
                </>
              )}
            </p>
            <div className="tech-stack">
              <span className={`tech-badge ${isOnline ? 'active' : ''}`}>Supabase</span>
              <span className={`tech-badge ${isOnline ? 'active' : ''}`}>PostgreSQL</span>
              <span className={`tech-badge ${isOnline ? 'active' : ''}`}>Real-time</span>
              <span className={`tech-badge ${isOnline ? 'active' : ''}`}>Row Level Security</span>
            </div>
            
            {isLoading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Loading reviews from database...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentsReviews;